#!/bin/sh
#
#   This file initializes the content of the submodules (repositories) referred to by this project.
#
#   If you find that _common or build directories are empty, run this file!
#
git submodule init
git submodule update
