---
title: Redis high availavility installation
date: 2017-03-01
layout: Post
hero: ../../assets/hands.svg
---

# Install redis in a host <APP_SERVER_1_IP>

```shell
wget http://download.redis.io/releases/redis-3.2.8.tar.gz
tar xzf redis-3.2.8.tar.gz
cd redis-3.2.8/
make
cd utils
sudo ./install_server.sh
```

# Fill form

```shell
Port           : 6379
Config file    : /etc/redis/redis_6379.conf
Log file       : /var/log/redis_6379.log
Data dir       : /var/lib/redis/6379
Executable     : /home/vagrant/redis-3.2.8/src/redis-server
Cli Executable : /home/vagrant/redis-3.2.8/src/redis-clii
```

# Configure redis_6379.conf with next configuration

```shell
bind <APP_SERVER_1_IP> 127.0.0.1
port 6379
slave-priority 1
```

# Create sentinel.conf file

```shell
bind <APP_SERVER_1_IP>
sentinel monitor redismaster <APP_SERVER_1_IP> 6379 2  
sentinel down-after-milliseconds redismaster 6000 
daemonize yes
loglevel verbose
logfile "/var/log/sentinel.log"
pidfile "/var/run/redis_26379.pid"
```

# Start sentinel

```shell
sudo ./install_server.sh
/*nohup ./redis-server /home/vagrant/redis-3.2.8/utils/sentinel.conf --sentinel &*/
```

# Change /etc/init.d/redis_26379

```shell
#!/bin/sh
#Configurations injected by install_server below....

EXEC=/home/vagrant/redis-3.2.8/src/redis-server
CLIEXEC=/home/vagrant/redis-3.2.8/src/redis-cli
PIDFILE=/var/run/redis_26379.pid
CONF="/etc/redis/sentinel.conf"
REDISPORT="26379"
LOGFILE="/var/log/sentinel.log"
###############
# SysV Init Information
# chkconfig: - 58 74
# description: redis_26379 is the redis daemon.
### BEGIN INIT INFO
# Provides: redis_26379
# Required-Start: $network $local_fs $remote_fs
# Required-Stop: $network $local_fs $remote_fs
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Should-Start: $syslog $named
# Should-Stop: $syslog $named
# Short-Description: start and stop redis_26379
# Description: Redis daemon
### END INIT INFO


case "$1" in
    start)
        if [ -f $PIDFILE ]
        then
            echo "$PIDFILE exists, process is already running or crashed"
        else
            echo "Starting Redis server..."
            $EXEC $CONF --sentinel
        fi
        ;;
    stop)
        if [ ! -f $PIDFILE ]
        then
            echo "$PIDFILE does not exist, process is not running"
        else
            PID=$(cat $PIDFILE)
            echo "Stopping ..."
            kill -9 $PID
            rm $PIDFILE
            while [ -x /proc/${PID} ]
            do
                echo "Waiting for Redis to shutdown ..."
                sleep 1
            done
            echo "Redis stopped"
        fi
        ;;
    status)
        PID=$(cat $PIDFILE)
        if [ ! -x /proc/${PID} ]
        then
            echo 'Redis is not running'
        else
            echo "Redis is running ($PID)"
        fi
        ;;
    restart)
        $0 stop
        $0 start
        ;;
    *)
        echo "Please use start, stop, restart or status as first argument"
        ;;
esac
```

# Install redis in another host <APP_SERVER_2_IP>

```shell
wget http://download.redis.io/releases/redis-3.2.8.tar.gz
tar xzf redis-3.2.8.tar.gz
cd redis-3.2.8/
make
cd utils
sudo ./install_server.sh
```

# Fill form

```shell
Port           : 6379
Config file    : /etc/redis/6379.conf
Log file       : /var/log/redis_6379.log
Data dir       : /var/lib/redis/6379
Executable     : /home/vagrant/redis-3.2.8/src/redis-server
Cli Executable : /home/vagrant/redis-3.2.8/src/redis-cli
```

# Configure redis_6379.conf with next configuration

```shell
bind <APP_SERVER_2_IP>
port 6379
slave-priority 10
slaveof <APP_SERVER_1_IP> 6379
```

# Create sentinel.conf file

```shell
bind <APP_SERVER_2_IP>
sentinel monitor redismaster <APP_SERVER_2_IP> 6379 2  
sentinel down-after-milliseconds redismaster 6000
```

# Start sentinel

```shell
sudo ./install_server.sh
/*nohup ./redis-server /etc/redis/sentinel.conf --sentinel &*/
```

# Install sentinel in a host <APP_SERVER_3_IP>

```shell
wget http://download.redis.io/releases/redis-3.2.8.tar.gz
tar xzf redis-3.2.8.tar.gz
cd redis-3.2.8/
make
cd utils
sudo ./install_server.sh
```

# Configure sentinel.conf

```shell
bind <APP_SERVER_3_IP>
sentinel monitor redismaster <APP_SERVER_3_IP> 6379 2
```

# Start sentinel

```shell
sudo ./install_server.sh
/*nohup ./redis-server /home/vagrant/redis-3.2.8/sentinel.conf --sentinel &*/
```

# Knowed bugs

## If you see in log:

```shell
7137:S 14 Mar 08:22:14.347 * Retrying with SYNC...
7137:S 14 Mar 08:22:14.347 # MASTER aborted replication with an error: ERR Can't SYNC while not connected with my master
7137:S 14 Mar 08:22:15.348 * Connecting to MASTER <APP_SERVER_1_IP>:6379
7137:S 14 Mar 08:22:15.349 * MASTER <-> SLAVE sync started
7137:S 14 Mar 08:22:15.349 * Non blocking connect for SYNC fired the event.
7137:S 14 Mar 08:22:15.350 * Master replied to PING, replication can continue...
7137:S 14 Mar 08:22:15.350 * Partial resynchronization not possible (no cached master)
7137:S 14 Mar 08:22:15.351 * Master does not support PSYNC or is in error state (reply: -ERR Can't SYNC while not connected with my master)
```

You need to connect to redis-cli and execute this commands:

```shell
CONFIG SET slave-serve-stale-data yes
SLAVEOF NO ONE
CONFIG SET slave-serve-stale-data no
```
# cli command utils

```shell
/home/vagrant/redis-3.2.8/src/redis-cli

To see node role

INFO Replication

To see all stored data in cache

KEYS *

To see all ordered keys 

ZRANGE contactData~keys 0 -1 WITHSCORES

To get value of one key

GET "<<key>>"
```

Reference: http://enmilocalfunciona.io/configuracion-basica-de-un-cluster-redis-sentinel-bajo-unix/
