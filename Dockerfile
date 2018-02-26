FROM ubuntu:latest

# Install MySQL.
ENV MYSQL_USER=mysql \
    MYSQL_DATA_DIR=/var/lib/mysql \
    MYSQL_RUN_DIR=/run/mysqld \
    MYSQL_LOG_DIR=/var/log/mysql

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server && \ 
    rm -rf ${MYSQL_DATA_DIR} && \
    rm -rf /var/lib/apt/lists/*

# Install cURL.
RUN apt-get update && \
    apt-get -y install curl && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js 8.x.
RUN curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get -y install nodejs build-essential && \
    rm nodesource_setup.sh && \
    rm -rf /var/lib/apt/lists/*

# Install NPM v5.
RUN npm i -g npm@5

# Set up ulimits.
RUN echo "$user     hard    nproc       20" >> /etc/security/limits.conf

# Copy start scripts.
COPY ./service /service

# Expose ports.
EXPOSE 80 8080

# Expose volume mount points.
VOLUME ["${MYSQL_DATA_DIR}", "${MYSQL_RUN_DIR}", "/var/www/app", "/var/www/api"]

# Entrypoint.
ENTRYPOINT ["/bin/bash", "/service/start_services.sh"]
