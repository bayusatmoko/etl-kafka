FROM debezium/connect:1.6

# Add the JDBC Sink Connector plugin
RUN curl -L -o /kafka/connect/jdbc.jar https://repo1.maven.org/maven2/io/confluent/kafka-connect-jdbc/5.5.1/kafka-connect-jdbc-5.5.1.jar