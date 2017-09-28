---
title: Ansible get started
date: 2017-05-31
layout: Post
hero: ../../assets/hands.svg
---

ansible -m raw -a 'sudo pkg install -y python2' -u <<username>> <<ip>>
sudo pkg install -y python27
sudo ln -s /usr/local/bin/python2.7 python
sudo ln -s /usr/local/bin/python2.7 /usr/bin/python
ansible-playbook <<playbook.yml>> -s -u <<username>> --extra-vars "ansible_sudo_pass=<<password>>"
