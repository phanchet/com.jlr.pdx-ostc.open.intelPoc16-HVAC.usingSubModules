# HVAC app for Tizen IVI #

To view this as a formatted file, use chrome extension [Markdown Preview](https://chrome.google.com/webstore/search/markdown), (NOT Markdown Preview Plus!)

**Note:** For purposes of discussion in this document, "subrepository" *means* "submodule" (the git term for a repository 
contained within the structure of another repository.) 

## Initializing the repository is **Required** ##
When you first clone this repository, you will need to either run the init_submodules.sh script, or perform the
commands contained in the script (git submodule init; git submodule update) by hand:

	vbu15$ **./init_submodules.sh**		# (in the root of the repository

## Updating the repository ##
Because this project uses (two) submodules, committing updates and pushing them to other repositories is more 
complex that without submodules.

### Updating submodules (_common and builder) ###
The submodules of this project are located under <em>applications/hvac/_common</em> and <em>builder</em>, 
relative to the root of the repository.

Within these submodules (or subrepositories) the normal git repository commands work as expected to maintain
the the (sub) repository-- **with one exception**: When the owning repository is first initialized and then 
the submodules/subrepositories are initialized, no branch is selected in the subrepository! (If you're interested, 
that's because the master repository is synched to the *commit* of the subrepository, not to a particular branch.)

So the first thing you need to do when modifying a file in the subrepository is to check out a branch, possibly 
create a new branch to do your work on, committing updates and merging branches as you might in normal circumstances.

		applications/hvac/_common$ git checkout master

### Pushing changes to another repository ###
Pushing to another repository requires that you follow some simple steps.  In this case we have HVAC (the main 
repository) that contains Build and Common as subrepositories:

	1. Ensure that all changes in Build and Common have been committed!  It's a good idea to refresh 
	   the content your submodules by doing a pull (or fetch and merge) in of any new changes in the 
	   subrepositories-- else your main repository won't update to integrate new stuff in Build or 
	   Common:

		cd Builder; git pull
		cd Common; git pull

	2. Push the changed repositories to the proper targets-- Probably origin, but maybe not if 
	   you are pushing to a repository other than the source of your repository:

		cd Builder; git commit -a; git push origin
		cd Common; git commit -a; git push origin

	   Notice that if you fail to commit changed files from your local repository, when someone else 
	   pulls down Builder or Common, they won't get the changed files (Naturally!) even though you can 
	   see the changed files on your own system.

	3. Now, update your master repository and push it to your target:

		cd HVAC; git add Builder; git add Common; git commit
		git push origin

	   Keep in mind that the repository (in this case, origin)  is always synched to the last commit 
	   at the time you (re)add the subrepository to the master.  It sounds complicated, but it's not.

Another thing to remember is that within the subrepositories, the origin repository will be the same
as the master you are pulling/cloning from-- That means that whenever you clone the *master* repository
(in this case, HVAC), the contained subrepositories will still point to the original subrepository 
origin.

What this means is that if you've cloned HVAC from a "public" repository, as you commit and push changes from
the subrepository they will show up directly in the public versions of Build and Common. If you want to keep
your changes private, you'll have to manually adjust the orgin of the subrepository. For reference, the master
repository tracks the source of the subrepository in .gitmodules (used when you do a "git submodule init") and 
the subrepository tracks its own origin as well (can be changed by "cd SubModule; git remote rm origin; 
git remote add origin new_url")

***Recommended:*** figure out what you need to do to maintain your repositories the way you work with them and write
some scripts to automate doing it.  That will minimize your chance of making a mistake, and if you do then
you'll be doing it consistently!


## Setting up SSH ##
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

Consult [this article](http://nerderati.com/2011/03/simplify-your-life-with-an-ssh-config-file/) for a brief explanation 
of setting up your ssh config file.

## Configuring the build system ##
There is a file buildCfg_default.xml contained in the builder directory.  This file can be renamed to .builder.xml
and moved to the user's home directory (pointed to by the environment variable HOME).  From there, it can be shared
amongst all applications that are built with the builder repository.  In this way you'll only need to set configuration
once in a master file instead of doing it for every repository you clone.
