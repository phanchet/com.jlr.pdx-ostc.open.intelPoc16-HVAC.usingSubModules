HVAC app for Tizen IVI
==========================================

When you first clone this repository, you will need to either run the init_submodules.sh script, or perform the
commands contained in the script (git submodule init; git submodule update) by hand.

If you are asked for a password when you run init_submodules.sh, it probably means that your name on the local
machine is different from your name on the git host (especially if the login fails!)

Go to your ssh config file (on Linux it is "~/.ssh/config") and open it with your favorite editor.  Add the
following lines (substituting as necessary):

	Host git
		Hostname git
		IdentityFile ~/.ssh/id_rsa
		User your_name_on_git

You can use what ever name you want for git in the host line-- This is the short hand name you will use for the git
ssh: host ("ssh://git/home/phanchet/sandbox/myrepo").  Hostname is the real DNS name for the target machine.

Consult this article for a brief explanation of setting up your ssh config file:

	http://nerderati.com/2011/03/simplify-your-life-with-an-ssh-config-file/

There is a file buildCfg_default.xml contained in the builder directory.  This file can be renamed to .builder.xml
and moved to the user's home directory (pointed to by the environment variable HOME).  From there, it can be shared
amongst all applications that are built with the builder repository.  In this way you'll only need to set configuration
once in a master file instead of doing it for every repository you clone.
