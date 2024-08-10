FROM debezium/connect:1.6

# Install curl
USER root
RUN yum -y install curl && yum clean all
USER kafka

# Download the JDBC Sink Connector plugin
RUN curl -L -o /tmp/confluentinc-kafka-connect-jdbc-10.0.2.zip https://d1i4a15mxbxib1.cloudfront.net/api/plugins/confluentinc/kafka-connect-jdbc/versions/10.0.2/confluentinc-kafka-connect-jdbc-10.0.2.zip

# Unzip the plugin
RUN unzip /tmp/confluentinc-kafka-connect-jdbc-10.0.2.zip -d /kafka/connect

# Remove the ZIP file
RUN rm /tmp/confluentinc-kafka-connect-jdbc-10.0.2.zip