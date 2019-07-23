---
title: Apache Tunning for Liferay
date: 2017-05-18
layout: Post
hero: ../../assets/hands.svg
---

# vim /etc/sysconfig/httpd

First change default prefork MPM for mutli-thread & multi-process worker MPM:

```
Uncomment HTTPD=/usr/sbin/httpd.worker
```

# vim /etc/httpd/conf/httpd.conf

Configure MPM worker:

```
<IfModule worker.c>
ServerLimit             250
StartServers             10
MaxClients              800
MinSpareThreads          75
MaxSpareThreads         250
ThreadLimit              64
ThreadsPerChild          32
MaxRequestsPerChild   10000
</IfModule>

```

Configure mod_disk_cache for serve liferay document_library. With two minutes cache is sufficient to increase liferay performance.

```
   <IfModule mod_disk_cache.c>
    CacheDirLevels 10
    CacheDirLength 2
    CacheEnable disk /documents/20182/
    CacheRoot "/tmp/cache"
    CacheIgnoreCacheControl On
    CacheStorePrivate On
    CacheStoreNoStore On
    CacheMaxFileSize 10000000
    CacheIgnoreNoLastMod On
    CacheIgnoreURLSessionIdentifiers On
    CacheMaxExpire 120
    CacheDefaultExpire 120
   </IfModule>

```

Unmount apj13 path for publish liferay theme images.

```
    JkUnMount /liferay-theme/images/* worker1
```

Create alias in httpd.conf for liferay-theme/images

```
Alias /theme/ "/var/www/theme/"

<Directory "/var/www/theme/">
    Options Indexes MultiViews FollowSymLinks
    AllowOverride None
    Order allow,deny
    Allow from all
</Directory>

```
Copy bundle deployed liferay theme images into /var/www/theme

```
cp -r /opt/liferay/liferay-portal-6.2-ee-sp11/tomcat-7.0.42/webapps/theme/* /var/www/theme
```

Restart apache

```
/etc/init.d/httpd restart
```

With this configuration, your Liferay instance now can solve "The C10K problem"!!
