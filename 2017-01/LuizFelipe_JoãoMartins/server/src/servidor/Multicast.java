package servidor;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;
import java.util.Calendar;
import java.util.HashMap;

public class Multicast {
	
	private final MulticastSocket mSocket;
	private final String host;
	private final int port;
	private final InetAddress group;
	private HashMap<String, String> onlineMap;

	public Multicast() throws IOException, InterruptedException {
		this.host = "225.1.2.3";
		this.port = 8889;
		this.group = InetAddress.getByName(this.host);
		mSocket = new MulticastSocket(this.port);
		mSocket.joinGroup(this.group);
		this.onlineMap = new HashMap<>();
	}
	
	public void clientMulticast(String message) throws IOException {
		byte[] msgByte = message.getBytes();
		DatagramPacket msgDataOut = new DatagramPacket(msgByte,  msgByte.length, this.group, this.port);
		mSocket.send(msgDataOut);
	}
	
	public void serverMulticast() throws IOException{
		while(true) {
			byte[] msgByte = new byte[1000];
			DatagramPacket msgDataIn = new DatagramPacket(msgByte, msgByte.length);
			mSocket.receive(msgDataIn);
			String msg = new String(msgDataIn.getData(), 0, msgDataIn.getLength());
			onlineMap.put(msgDataIn.getAddress().getHostAddress(), msg);
			
		}
	}
	
	public void sendMessage(String message) throws IOException {
		clientMulticast(message);
	}

	public HashMap<String, String> getOnlineMap() {
		return onlineMap;
	}

	public MulticastSocket getmSocket() {
		return mSocket;
	}

}
