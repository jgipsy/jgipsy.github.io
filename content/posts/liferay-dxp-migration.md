---
title: Liferay DXP migration
date: 2017-04-26
layout: Post
hero: ../../assets/hands.svg
---

*Configure OLD 6.2 Liferay Portal in local env*

* Get mysql dump and store in local filesystem
* Start mysql docker container with 6.2 liferay mysql database

```shell
docker run --name bonpreu_62 -v /home/amartinez/ANGEL/PROJECTS/BONPREU/mysql:/docker-entrypoint-initdb.d -e MYSQL_ROOT_PASSWORD=bonpreu -d mysql
```

* Configure buid.properties and buid.amartinez.properties in Liferay 6.2 workspace 

```
app.server.parent.dir=${sdk.dir}/../bundle/liferay-portal-6.2-ee-sp11/tomcat-7.0.42
```

```
app.server.tomcat.lib.global.dir = /home/amartinez/ANGEL/PROJECTS/BONPREU/bundle/liferay-portal-6.2-ee-sp11/tomcat-7.0.42/lib/ext
app.server.tomcat.deploy.dir = /home/amartinez/ANGEL/PROJECTS/BONPREU/bundle/liferay-portal-6.2-ee-sp11/tomcat-7.0.42/webapps
app.server.parent.dir = /home/amartinez/ANGEL/PROJECTS/BONPREU/bundle/liferay-portal-6.2-ee-sp11
app.server.tomcat.dir = /home/amartinez/ANGEL/PROJECTS/BONPREU/bundle/liferay-portal-6.2-ee-sp11/tomcat-7.0.42
app.server.type = tomcat
app.server.tomcat.portal.dir = /home/amartinez/ANGEL/PROJECTS/BONPREU/bundle/liferay-portal-6.2-ee-sp11/tomcat-7.0.42/webapps/ROOT
```

* In Eclipse IDE import Liferay Projects From Plugins SDK
* Configure Liferay 6.2.10 in Eclipse Servers view
* Configure in portal-ext.properties docker database

- Get IP
```shell
docker inspect bonpreu_62 | grep \"IPAddress\"
```

- Set database configuration in portal-ext.properties
```
jdbc.default.url=jdbc:mysql://172.17.0.3:3306/bonpreudb?useUnicode=true&characterEncoding=UTF-8&useFastDateParsing=false
jdbc.default.username=bonpreuext
jdbc.default.password=bonpreuext
```









