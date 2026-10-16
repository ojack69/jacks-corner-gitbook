#!/bin/bash
set -Eeuo pipefail

FRIDA_RELEASES_URL="https://github.com/frida/frida/releases"
INSTALL_PATH="${FRIDA_INSTALL_PATH:-$HOME/.frida-manager}"
CURL_OPTS=(--fail --silent --show-error --location --retry 2 --connect-timeout 10)

fprint() {
    local value="$1" level="${2:-0}"
    case "$level" in
        0) printf '[>] %s\n' "$value" ;;
        1) printf '[!] %s\n' "$value" >&2 ;;
        *) printf '[x] %s\n' "$value" >&2 ;;
    esac
}

die() {
    fprint "$1" 2
    exit "${2:-1}"
}

usage() {
    cat <<'EOF'
Frida version manager

Usage:
  frida-manager <command> [arguments]

Commands:
  list-online [--page N]
      List online Frida releases. Defaults to page 1.

  search-online <query> [--page N]
      Search online Frida releases. Defaults to page 1.

  install <version>
      Install a Frida version in an isolated virtual environment.

  list-installed
      List locally installed Frida versions.

  uninstall <version>
      Uninstall a local version after confirmation.

  help
      Display this help.

Examples:
  frida-manager list-online
  frida-manager list-online --page 2
  frida-manager search-online 16.2
  frida-manager search-online "16.2" --page 2
  frida-manager install 16.5.6
  frida-manager list-installed
  frida-manager uninstall 16.5.6

Environment:
  FRIDA_INSTALL_PATH   Installation directory
                       (default: ~/.frida-manager)
EOF
}

validate_page() {
    [[ "$1" =~ ^[1-9][0-9]*$ ]] ||
        die "Page must be a positive integer: $1"
}

validate_version() {
    [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][A-Za-z0-9.-]+)?$ ]] ||
        die "Invalid version: $1"
}

parse_release() {
    grep -oE 'data-item-id="release-[0-9]+\.[0-9]+\.[0-9]+"' |
        grep -oE '[0-9]+\.[0-9]+\.[0-9]+' |
        awk '!seen[$0]++'
}

list_online() {
    local page=1

    while (($#)); do
        case "$1" in
            --page|-p)
                (($# >= 2)) || die "Missing page number."
                page="$2"
                shift 2
                ;;
            --help|-h)
                usage
                return 0
                ;;
            *)
                die "Unknown list-online argument: $1"
                ;;
        esac
    done

    validate_page "$page"

    local result versions
    result=$(curl "${CURL_OPTS[@]}" \
        "${FRIDA_RELEASES_URL}?page=${page}") ||
        die "Failed to fetch GitHub releases."

    versions=$(printf '%s' "$result" | parse_release || true)

    if [[ -z "$versions" ]]; then
        fprint "No releases found on page $page." 1
        return 0
    fi

    printf '%s\n' "$versions"
}

search_online() {
    (($# >= 1)) ||
        die "Usage: frida-manager search-online <query> [--page N]"

    local query="$1"
    local page=1
    shift

    while (($#)); do
        case "$1" in
            --page|-p)
                (($# >= 2)) || die "Missing page number."
                page="$2"
                shift 2
                ;;
            --help|-h)
                usage
                return 0
                ;;
            *)
                die "Unknown search-online argument: $1"
                ;;
        esac
    done

    [[ -n "$query" ]] || die "Search query must not be empty."
    validate_page "$page"

    local encoded_query result versions
    encoded_query=$(
        python3 -c \
            'import sys, urllib.parse; print(urllib.parse.quote_plus(sys.argv[1]))' \
            "$query"
    ) || die "Could not encode search query."

    result=$(curl "${CURL_OPTS[@]}" \
        "${FRIDA_RELEASES_URL}?expanded=true&page=${page}&q=${encoded_query}") ||
        die "Failed to search GitHub releases."

    versions=$(printf '%s' "$result" | parse_release || true)

    if [[ -z "$versions" ]]; then
        fprint "No releases found for '$query' on page $page." 1
        return 0
    fi

    printf '%s\n' "$versions"
}

check_installed() {
    [[ -d "$INSTALL_PATH/$1" &&
       -x "$INSTALL_PATH/$1/bin/python" ]]
}

list_installed() {
    if [[ ! -d "$INSTALL_PATH" ]]; then
        fprint "No Frida versions installed in $INSTALL_PATH." 1
        return 0
    fi

    local found=0 dir version

    for dir in "$INSTALL_PATH"/*; do
        [[ -d "$dir" ]] || continue

        version="${dir##*/}"

        if [[ -x "$dir/bin/python" ]] &&
           "$dir/bin/python" -m pip show frida >/dev/null 2>&1; then
            printf '%s - %s\n' "$version" "$dir"
            found=1
        fi
    done

    ((found)) || fprint "No Frida versions installed." 1
}

install_version() {
    (($# == 1)) || die "Usage: frida-manager install <version>"

    local version="$1"
    validate_version "$version"

    if check_installed "$version"; then
        fprint "Frida $version is already installed." 1
        return 0
    fi

    command -v python3 >/dev/null 2>&1 ||
        die "python3 is required."

    mkdir -p "$INSTALL_PATH"

    local target="$INSTALL_PATH/$version"

    [[ ! -e "$target" ]] ||
        die "Target already exists but is not a valid installation: $target"

    fprint "Creating virtual environment for Frida $version..." 0

    if ! python3 -m venv "$target"; then
        rm -rf -- "$target"
        die "Failed to create virtual environment. Check your Python venv installation."
    fi

    if ! "$target/bin/python" -m pip install --upgrade pip ||
       ! "$target/bin/python" -m pip install "frida==$version" frida-tools; then
        rm -rf -- "$target"
        die "Installation failed; removed incomplete environment."
    fi

    fprint "Installed Frida $version at $target" 0
}

uninstall_version() {
    (($# == 1)) || die "Usage: frida-manager uninstall <version>"

    local version="$1"
    validate_version "$version"

    local target="$INSTALL_PATH/$version"

    check_installed "$version" ||
        die "Frida $version is not installed in $INSTALL_PATH."

    local answer
    read -r -p "Remove Frida $version from '$target'? [y/N] " answer

    case "$answer" in
        y|Y|yes|YES)
            rm -rf -- "$target"
            fprint "Uninstalled Frida $version." 0
            ;;
        *)
            fprint "Cancelled." 1
            ;;
    esac
}

main() {
    (($#)) || {
        usage
        exit 2
    }

    local command="$1"
    shift

    case "$command" in
        list-online|list)
            list_online "$@"
            ;;
        search-online|search)
            search_online "$@"
            ;;
        install)
            install_version "$@"
            ;;
        list-installed|installed)
            (($# == 0)) ||
                die "list-installed takes no arguments."
            list_installed
            ;;
        uninstall|remove)
            uninstall_version "$@"
            ;;
        help|-h|--help)
            usage
            ;;
        *)
            fprint "Unknown command: $command" 2
            usage >&2
            exit 2
            ;;
    esac
}

main "$@"

