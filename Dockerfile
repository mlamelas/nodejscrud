FROM    centos:centos6

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN yum install -y epel-release
# Install Node.js and npm
RUN yum install -y nodejs npm

# Bundle app source
COPY src /src
# Install app dependencies
WORKDIR /src

RUN npm install


EXPOSE 3000
CMD ["npm", "start"]

