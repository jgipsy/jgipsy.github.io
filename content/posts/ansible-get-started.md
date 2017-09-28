---
title: Ansible get started
date: 2017-05-31
layout: Post
hero: ../../assets/hands.svg
---

1. instalar ansible en vuestro maquina local. En mi caso, ubuntu:

```shell
sudo apt-get install -y ansible
```

2. Configurar las ips de los hosts a gestionar con ansible:

```shell
sudo vim /etc/ansible/hosts

[TAG]
ip1
ip2
...
ipN
```
3. Importante, se tiene que instalar python2 en todas las máquinas

```shell
ansible -m raw -a 'sudo pkg install -y python2' -u <<username>> <<ip>>
sudo pkg install -y python27
sudo ln -s /usr/local/bin/python2.7 python
sudo ln -s /usr/local/bin/python2.7 /usr/bin/python
```

4. Crear el playbook que se desee

5. Ejecutar el playbook

```shell
ansible-playbook <<playbook.yml>> -s -u <<username>> --extra-vars "ansible_sudo_pass=<<password>>"
```
