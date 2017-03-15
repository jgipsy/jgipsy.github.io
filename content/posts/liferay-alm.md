---
title: Liferay ALM
date: 2017-15-01
layout: Post
hero: ../../assets/hands.svg
---

*Under construction*

* Distribución normal

	Casi todo en la naturaleza cumple una distribución normal. Esto que significa? Que 95% de cualquier población no está a más de 2 veces la desviació estandard de la media. Solo el 5% queda fuera de este rando. Un ejemplo, si la población a analizar son los trabajadores de OT, el 95% de los trabajadores tendrán unos skills normales. Solo el 2,5% tendrán skills superiores y por desgracia, otro 2,5% tendrán skills inferiores. Para vuestra tranquilidad ya os digo que al haber asistido a esta openTalk ya estáis demostrando no estar en ese 2,5% inferior (y seguramente tampoco en el 2,5% superior!)

	¿Con esto que os quiero decir? Pues que los que os voy a enseñar es una solución normal, implementado con aplicaciones normales, para que ayudar a informáticos normales con el fin de poder realizar soluciones excelentes ;)

* El proyecto

	El caso que nos atañe (el problema) es la creación de un portal (algo normal) para un importante cliente que tenia la necesidad de gestionar una comunidad de voluntarios de forma telemática. CRM, CMS, esa delgada línea entre un tipo de producto u otro. Aquí la solución (o problema) que se tomó para implementar este portal fue recurrir al tan manido a la par que querido Liferay. En su versión 6.2EE (no recuerdo que SP, creo que el 15). Hasta aquí todo bien. Entonces fue cuando empezamos a complicarnos un poco la vida. Para darle un toque diferenciador (que para eso estamos en OT) y siguiendo las tendencias actuales (no se si tecnologicas o marketinianas, o quizás sendas cosas) se decidió añadir una pizca de Angular a la receta. Pero como suele pasar con la sal, se nos fue la mano con el salero. Ah, se me olvidaba. No contentos de añadir Angular, tiramos la casa por la ventana, y decidimos desplegar el Liferay en la plataforma Cloud de este importante cliente. Comento para decir que en dicho PAAS (implantado por OT) ya hay más de 20 Liferays corriendo (de un total de 212 aps, aproximadamente el 10%).

* La organización del proyecto

	Organización del proyecto. Se decidió usar dos equipos de trabajo para afrontar este proyecto. Un equipo backend con especialistas Liferay. Y un equipo de Backend con especialistas Angular. Y alguien que metiese un poco de pegamento (yo). 
	Dos equipos de trabajo completamente independientes. Tan independientes que cada uno tenia su repositorio SVN:

	Backend, un repositorio con la estructura necesaria del Liferay con sus respectivos portlets que mas adelante os detallaré.
	Frontend, un respositorio con la estructura necesaria para implementar multiples modulos angular (uno por cada portlet angular).

	Este tipo de organización, dado que hay un contrato que cumplir entre las dos partes, es casi imposible independizarlo completamente. Basicamente es imposible, por timings del proyecto. Al estar en fase de desarrollo el backend (liferay) la madurez de su api no se alcanza hasta fases tardias. Esto implica que, para que fuese rodado, el frontend (desarrollo angular) tendría que realiarlse después del desarrollo del liferay. 

	Este tipo de organización es muy parecida a la organización que se utiliza en el desarrollo de una app movil. Se pacta la api entre middleware y app al principio del desarrollo y luego se va haciendo. El error que se cometió en este proyecto, es que la gente de angular trabajaba contra un mock del servicio en lugar de contra el entorno de dev. Y por tanto, ellos daban siempre por finalizado el trabajo antes de que realmente estuviese finalizado (pues la api real tenia diferencias siempre con el mock).
	
* Stack Backend

	SCM - SVN
	Codigo - Liferay mavenizado. pom padre con dependencias y configuraciones comunes y un pom hijo por cada portlet. 
	Construcción - 
		mvn liferay:build-services
		mvn liferay:build-theme
		mvn deploy
	Entorno DEV: Tomcat / Jdk6 / mySQL XX

* Stack Frontend

	SCM - SVN
	Codigo - AngularJS. Bower como gestor de dependencias, gulp como herramienta de construcción. Compass para CSS (necesidad de instalar rubi como compilador de compass).
	Entorno DEV: Apache / PHP / Mockup

* Reglas del juego

	El contrato de backend va a misa. Documentación en redmine. 
	Backend Liferay se comporta como una API REST para frontEnd.
	El trabajo de frontend no finaliza en el Mockup. Finaliza en el Liferay de DEV. [NECESIDAD QUE EL ENTORNO DE MOCKUP ESTÉ CONECTADO A ENTORNO DEV LIFERAY]
	El portlet no se me ve. ¿De quien es la culpa? Lo revisan conjuntamente los desarrolladores del portlet Liferay y del module Angular.
	
* Construcción compartida

	* Construir Frontend con Gulp -> Salida: main.js por portlet / Assets, css y js para tema Liferay 
	* Copiar js, css y assets generados en la construcción del frontend en cada uno de los portlets y tema (en tiempo de construcción)
	* Construir portlets y tema liferay con maven 
	* Cada unos de los wars generados en la construcción de liferay copiarlos el carpeta deploy del tomcat del liferay de DEV
	* Generación diaria de snapshot de la BBDD del liferay y del content fs de liferay (esto nos servia para poder tener entornos locales totalmente funcionales)

* Ciclo de vida DEV

	Cada noche se generaba versión SNAPSHOT y se instalaba en DEV
	Bajo demanda, si se tenía que realizar versión para QA, se generaba RELEASE y se desplegaba en entorno de QA (Clonico de entorno de DEV). El fs y la BBDD se copiaban a mano (documentado)
	Subir código release validada por QA en SCM cliente. Ejecutar Hudson cliente para construcción y validación reglas calidad en Sonar.
	Copian este código a SVN Cloud y alli se construye la versión para PRE. Se instala a petición a través de herramienta construcción visual.

* *Ciclo de vida PRO*

	SCM - SVN
	Hook post-commit en SVN que invoca la ejecución de un Job Jenkins Parametrizado
	Jenkins Corporativo (Build server)
	Job parametrizados. Parametros de entrada para diferenciar la tecnología y la aplicación e identificar equipo de trabajo (para notificaciones).
		Capaz de construir aplicaciones mavenizadas. Tanto PHP com Java. Maven dominando el mundo.
		Ejecutar reglas de calidad con perfiles de calidad personalizados por stack tecnologico.
		Construcción, ejecución de test unitarios.
		Almacenamiento del binario construido en Nexus Corporativo
	IDECLD (Herramienta de autorización y despliegue)
		Aplicación - Version - Tecnologia - Segmento - Equipo de trabajo - Responsable
		Despliegue a PRE - Job Jenkins despliegue a Cloud
		Aceptación versión PRE - Generación de release (Job parametrizado Jenkins)
		Despliegue en PRO - Job Jenkins despliegue a Cloud
		Acceso a BBDD temporal securizado (one-time-token)
		Consulta de logs
		Historico del ciclo de vida de la app
		Acceso al FS temporal securizado (one-time-token)
		
* Para los frikis de Liferay

	Detalle portlet angular

* Para los frikis de Angular

	NS/NR

* Para los frikis de ALM

	Gulp
	Bower
	Rvm
	Maven
	PAAS

* Para los frikis de Cloud

	vmc push / update
	buildpack
	variables de entorno JSON con datos conexión a servicio BBDD
	Cloudfoundry v1

