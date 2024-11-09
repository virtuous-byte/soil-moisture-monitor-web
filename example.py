import busio
import board
import digitalio
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn
import requests
import time
from io import BytesIO
import GPy
import numpy as np
import matplotlib.pyplot as plt
import sys

def get_percent(value: int, max_value = 65535):
    return abs(round((value / max_value) * 100) - 100)

def get_sensors(mcp: MCP.MCP3008) -> list[int]:
    return [
        get_percent(AnalogIn(mcp=mcp, positive_pin=MCP.P0).value),
        get_percent(AnalogIn(mcp=mcp, positive_pin=MCP.P1).value),
        get_percent(AnalogIn(mcp=mcp, positive_pin=MCP.P2).value),
        get_percent(AnalogIn(mcp=mcp, positive_pin=MCP.P3).value),
        get_percent(AnalogIn(mcp=mcp, positive_pin=MCP.P4).value),
        get_percent(AnalogIn(mcp=mcp, positive_pin=MCP.P5).value)
    ]

def send_sensor_rt(mcp: MCP.MCP3008, hostname: str, port: str):
    url = f"http://{hostname}:{port}/api/sensor"

    data = {
        "sensors": get_sensors(mcp)
    }

    response = requests.post(url, json=data)

    return response

def send_sensor_map(mcp: MCP.MCP3008, hostname: str, port: str):
    img_bytes = BytesIO()

    sensors = get_sensors(mcp)
    X = np.array([[6, 4.5], [12, 4.5], [18, 4.5], [6, 9], [12, 9], [18, 9]])
    Y = np.array([[sensors[0]], [sensors[1]], [sensors[2]], [sensors[3]], [sensors[4]], [sensors[5]]])
    kernel = GPy.kern.Matern32(input_dim=2, variance=1., lengthscale=1.)
    model = GPy.models.GPRegression(X, Y, kernel)
    model.optimize()
    x_grid = np.linspace(0, 24, 50)
    y_grid = np.linspace(0, 13.5, 50)
    X_grid, Y_grid = np.meshgrid(x_grid, y_grid)
    grid_points = np.hstack((X_grid.reshape(-1, 1), Y_grid.reshape(-1, 1)))
    mean, variance = model.predict(grid_points)
    plt.figure(figsize=(8, 8))
    plt.contourf(X_grid, Y_grid, mean.reshape(X_grid.shape), levels=50, cmap="viridis")
    plt.colorbar(label="Öngörülen Değerler")
    plt.scatter(X[:, 0], X[:, 1], c='red', label="Veri Noktaları")
    plt.title("Toprak Nem Haritası")
    plt.xlabel("X")
    plt.ylabel("Y")
    plt.legend()
    plt.savefig(img_bytes, format="JPEG")
    plt.close()

    img_bytes.seek(0)

    files = {
        "file": ("image.jpg", img_bytes, "image/jpeg")
    }

    url = f"http://{hostname}:{port}/api/maps"

    response = requests.post(url=url, files=files)
    return response

def send_sensor_logs(mcp: MCP.MCP3008, hostname: str, port: str):
    url = f"http://{hostname}:{port}/api/logs"

    data = {
        "sensors": get_sensors(mcp)
    }

    response = requests.post(url, json=data)
    return 0

def main():
    tick = 0

    every_five_sec = 0
    every_hour = 0
    every_fifteen_min = 0

    hostname = "ulgen"
    port = "3000"
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.CE0)
    mcp = MCP.MCP3008(spi_bus=spi, cs=cs, ref_voltage=3.3)

    if len(sys.argv) > 1:
        hostname = sys.argv[1]
    
    if len(sys.argv) > 2:
        port = sys.argv[2]
    
    send_sensor_map(mcp, hostname, port)

    while True:
        time.sleep(1)
        tick += 1

        if tick - every_five_sec >= 5:
            every_five_sec = tick

            response = send_sensor_rt(mcp, hostname, port)

            if response.ok:
                print("Success: ", response.json())
            else:
                print("Error: ", response.status_code, response.text)

	if tick - every_fifteen_min >= 900:
	    every_fifteen_min = tick
	
	    response = send_sensor_map(mcp, hostname, port)

            if response.ok:
                print("Success: ", response.json())
            else:
                print("Error: ", response.status_code, response.text)
    
        if tick - every_hour >= 3600:
            every_hour = tick

            response = send_sensor_logs(mcp, hostname, port)

            if response.ok:
                print("Success: ", response.json())
            else:
                print("Error: ", response.status_code, response.text)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram terminated by user")
