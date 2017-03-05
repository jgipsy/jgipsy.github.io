---
title: Git for dummies
date: 2017-03-01
layout: Post
hero: ../../assets/hands.svg
---

The basis of any computer project is the SCM. Without a good SCM it will be difficult to reach a good port.
So we want to show some first steps to work with GIT.

To start working with GIT, we recommend using an approach to the central repository philosophy (SVN style) against the philosophy of distributed repositories.

For this it is important to have Gitlab or Github as the central repository.

Starting from the topology that code repositories are embedded in a central server (either gitlab or github) a simple and intuitive way of working is as follows:

* Clone the master branch (or development) of the code repository
```shell
git clone <URL_REPO>.git
```

* Create a branch in local code for the functionality to be developed. It is important to create a branch for each functionality.
```shell
git branch feature/<feature-name>
```

* Work comfortably

* Before uploading, update the code in local with the master branch
```shell
git pull origin master
```

* If conflicts are found, solve them locally.

* Upload the code developed to the central repository
```shell
git add -A
git commit -m "comentario explicativo de las modificaicones realizadas"
git push origin feature/<feature-name>
```

* Perform from the management of the central repository (gitlab or github) a merge request or pull request to the master branch

* Check the merge request for another partner and do the code merge.