package servidor;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;

import com.google.gson.JsonObject;
import servidor.Responses;

public final class Server {
	
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	//static Actions database = new Actions();
    public static HashMap<String, String> hostFriendMap;
    public static Multicast multicast;
    
    public static void log(String message){
    	System.out.println(dateFormat.format(Calendar.getInstance().getTime()) + " " + message);
    }

    public static void main(String argv[]) throws Exception {
    	//Vetor de IPs e armazeno no banco de dados
    
    	//Map<String, String> friendServers = new HashMap<String, String>();
    	//String[] friendServers = {"http://172.16.1.212:8000/Game_Final/game.html","http://172.16.1.213:8000/Game_Final/game.html","http://172.16.1.214:8000/Game_Final/game.html","http://172.16.1.215:8000/Game_Final/game.html"};
    	//database.addFriendsIps(friendServers);
        int serverPort = 8000;
        String rootFolder = "/var/www";
        //createHTTPConnection("http://172.16.1.212:8000/Game_Final/game.html","{id:'1',op:'add-trophy',data:{name:'10 coins',xp:30,title:'ITS A START',description:'Collected first 10 coins on the game'}}");
        log("Game Server [Primeira entrega] | Status: Online - Porta:" + serverPort);
        
        multicast = new Multicast();
        hostFriendMap = new HashMap<>();
        
        // criar um thread e chamar um while true para o serverMulticast
        Runnable multiServerRun = new Runnable() {
			@Override
			public void run() {
				try {
					multicast.serverMulticast();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		};
		Thread multiServerThread = new Thread(multiServerRun);
		multiServerThread.start();
		
		Runnable multiClientRun = new Runnable() {
			@Override
			public void run() {
				try {
					while(true){
						Thread.sleep(3000);
						multicast.sendMessage("GameServer");
						hostFriendMap = multicast.getOnlineMap();
						System.out.println(hostFriendMap);
					}
				} catch (IOException | InterruptedException e) {
					e.printStackTrace();
				}
			}
		};
		Thread multiClientThread = new Thread(multiClientRun);
		multiClientThread.start();
        
        ServerSocket server = new ServerSocket(serverPort);
        while (true) {
            Socket socket = server.accept();
            new Thread(new RequestHandle(socket, rootFolder)).run();
        }
    }

	public static String createHTTPConnection(String targetURL, String requestContent) {
    	HttpURLConnection connection = null;
    	
  	  try {
  	    //Create connection
  	    URL url = new URL(targetURL);
  	    connection = (HttpURLConnection) url.openConnection();
  	    connection.setRequestMethod("POST");
  	    connection.setRequestProperty("Content-Type", 
  	        "application/x-www-form-urlencoded");

  	    connection.setRequestProperty("Content-Length", 
  	        Integer.toString(requestContent.getBytes().length));
  	    connection.setRequestProperty("Content-Language", "en-US");  

  	    connection.setUseCaches(false);
  	    connection.setDoOutput(true);

  	    //Send request
  	    DataOutputStream wr = new DataOutputStream (
  	        connection.getOutputStream());
  	    wr.writeBytes(requestContent);
  	    wr.close();

  	    //Get Response  
  	    InputStream is = connection.getInputStream();
  	    BufferedReader rd = new BufferedReader(new InputStreamReader(is));
  	    StringBuilder response = new StringBuilder(); // or StringBuffer if Java version 5+
  	    String line;
  	    while ((line = rd.readLine()) != null) {
  	      response.append(line);
  	      response.append('\r');
  	    }
  	    rd.close();
  	    return response.toString();
  	  } catch (Exception e) {
  	    e.printStackTrace();
  	    return null;
  	  } finally {
  	    if (connection != null) {
  	      connection.disconnect();
  	    }
  	  }
	}
}

final class RequestHandle implements Runnable {
	
    final static String CRLF = "\r\n";
    Socket socket;
    InputStream input;
    OutputStream output;
    String rootFolder;
    private Responses responses;
    private OperationHandler operation;
    private RequestBuilder requests;
    
    public RequestHandle(Socket socket, String rootFolder) throws Exception {
        this.socket = socket;
        this.input = socket.getInputStream();
        this.output = socket.getOutputStream();
        this.rootFolder = rootFolder;
    }
    
    @Override
    protected void finalize() throws Throwable {
    	super.finalize();
    	output.close();
        input.close();
        socket.close();
    }

    public void run() {
        try {
        	requests = new RequestBuilder(this.input);
        	responses = new Responses(requests.header.get("Host:"));
        	operation = new OperationHandler();
        	
            byte[] response = null;
            if (requests.header.containsKey("GET")) {
            	System.out.println(requests.header);
            	Server.log("[GET] Método recebido");
                response = responseGet();
            } else if(requests.header.containsKey("POST")){
            	Server.log("[POST] Método recebido");
            	response = responsePost();
            }
            else {
                response = responses.response501_NotImplemented();    
            }
            output.write(response);
            finalize();
            
        } catch (Throwable e) {
			Server.log(e.getMessage());
			e.printStackTrace();
		}        
    }
    
    private byte[] responsePost() throws Exception {
		Server.log("[JSON] Uma requisição foi recebida!");
		System.out.println(requests.body);
		String request = new String(requests.body);
		JsonObject response = operation.execute(request);
		return responses.responseJSON_Success(response);
    }

    private byte[] responseGet() throws Exception {
    	String request = requests.header.get("GET").split(" ")[0];
    	return responses.responseGame(rootFolder, request);
    }
}