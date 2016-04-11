# Default target
all: install lint

include targets/nodejs/base.mk
include targets/nodejs/lint.mk
include targets/shared/*.mk

# Project-specific information
ghuser = Alaneor
lintfiles = lib test
platform_t = v5.10

# Define version constraints
gh-pages: platform-version

# This file allows local Make target customisations without having to worry about them being
# accidentally commited to this file. local.mk is in gitignore. If this file does not exist, make
# Make not to panic.
-include local.mk
