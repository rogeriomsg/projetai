require('dotenv').config(); // Carrega o .env
const mqtt = require('mqtt')

// const protocol = process.env.MQTT_PROTOCOL;
// const host = process.env.MQTT_HOST;
// const port = process.env.MQTT_PORT;
// const clientID = `mqtt_${Math.random().toString(16).slice(3)}`
// const uri = `${protocol}://${host}:${port}`;

console.log("AQUI MQTT")

// const client = mqtt.connect(uri, {
//     clientID,
//     clean: true,
//     connectTimeout: 4000,
//     username: 'emqx',
//     password: 'public',
//     reconnectPeriod: 1000,
// })

// const topic = '/nodejs/mqtt'

// client.on('connect', () => {
//     console.log(`Connected para ${host}`)
  
//     client.subscribe([topic], () => {
//       console.log(`Subscribe to topic '${topic}'`)
//       client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
//         if (error) {
//           console.error(error)
//         }
//       })
//     })
// })



class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = process.env.MQTT_HOST;
        this.port = process.env.MQTT_PORT;
        this.protocol = process.env.MQTT_PROTOCOL;
        this.uri = `${this.protocol}://${this.host}:${this.port}`;

    }
    
    connect() 
    {
      // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        const clientID = `mqtt_${Math.random().toString(16).slice(3)}`;
        this.mqttClient = mqtt.connect(this.uri, {
            clientID,
            clean: true,
            connectTimeout: 4000,
            username: '',
            password: '',
            reconnectPeriod: 2000,
            will: {
                topic: 'location/gps/vehicle1',
                payload: 'Goodbye, HiveMQ!',
                qos: 1,
                retain: true
            }
        });
  
        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });
    
        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });
    
        // mqtt subscriptions
        this.mqttClient.subscribe('mytopic', {qos: 0});
    
        // When a message arrives, console.log it
        this.mqttClient.on('message', function (topic, message) {
            console.log(message.toString());
        });
    
        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
        this.mqttClient.on('reconnect', () => {
            console.log('mqtt client reconnecting...');
        });
        this.mqttClient.on('offline', () => {
            console.log('mqtt client is offline');
        });
        this.mqttClient.on('offline', () => {
            console.log('mqtt client is offline');
        });
    }
  
    // Sends a mqtt message to topic: mytopic
    sendMessage(message) {
      this.mqttClient.publish('mytopic', message,(err) => {
        if (err) {
          console.error('Error publishing message:', err);
        } else {
          console.log(`Message: '${message}' published successfully`);
        }
      });
    }
    publish(topic,payload)
    {
        this.mqttClient.publish(topic, payload ,(err) => {
            if (err) {
              console.error('Error publishing message:', err);
            } else {
              console.log(`Publish topic '${topic} with '${payload}' published successfully`);
            }
        });
    }
  }



module.exports = {
    //client,
    MqttHandler,
};


