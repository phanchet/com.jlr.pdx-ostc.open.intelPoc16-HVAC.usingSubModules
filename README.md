HVAC app for Tizen IVI
==========================================

When you first clone this repository, you will need to either run the init_submodules.sh script, or perform the
commands contained in the script (git submodule init; git submodule update) by hand.

There is a file buildCfg_default.xml contained in the builder directory.  This file can be renamed to .builder.xml
and moved to the user's home directory (pointed to by the environment variable HOME).  From there, it can be shared
amongst all applications that are built with the builder repository.  In this way you'll only need to set configuration
once in a master file instead of doing it for every repository you clone.
