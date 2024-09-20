import serial
import json
import time
import os

# Define the COM port and baud rate (ensure you replace 'COM6' with your actual port)
ser = serial.Serial('COM6', 9600, timeout=1)

# Define the JSON file to store sensor data
json_file_path = 'ui\public\data\sensordata.json'

def update_json_file(data):
    """Write the sensor data to a JSON file."""
    # Ensure the directory exists
    file_dir = os.path.dirname(json_file_path)
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)

    # Write the data to the file
    with open(json_file_path, 'w') as f:
        json.dump(data, f, indent=4)

def read_sensor_data():
    """Continuously read sensor data from Arduino and store it in a JSON file."""
    try:
        while True:
            # Read a line from the Serial port
            line = ser.readline().decode('utf-8').strip()

            # If the line is not empty
            if line:
                try:
                    # Parse the JSON data from the Arduino
                    data = json.loads(line)

                    # Print the received data for debugging
                    print("Received data:", data)

                    # Update the JSON file with new data
                    update_json_file(data)

                except json.JSONDecodeError:
                    # Handle JSON decoding errors
                    print("Error decoding JSON:", line)

            # Sleep for 2 seconds (adjust based on your sensor data rate)
            time.sleep(2)

    except KeyboardInterrupt:
        print("Stopping data reading...")

    finally:
        # Ensure that the Serial connection is closed
        ser.close()

read_sensor_data()
