ansible -m raw -a 'sudo pkg install -y python2' -u opentrends 192.168.3.102
sudo pkg install -y python27
sudo ln -s /usr/local/bin/python2.7 python
sudo ln -s /usr/local/bin/python2.7 /usr/bin/python
ansible-playbook purgeTmpFiles.adesa.yml -s -u angelmartinez --extra-vars "ansible_sudo_pass=2SgxvLXjnDaeEtKX"
