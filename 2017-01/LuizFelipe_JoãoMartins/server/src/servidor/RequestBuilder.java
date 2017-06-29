package servidor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;

public class RequestBuilder {
    /* 
     * HTTP-message   = start-line  
     *     ( header-field CRLF )  
     *     CRLF  
     *     [ message-body ]
     * */
	
    private BufferedReader reader;
	private InputStream input;
    public String requestPath;
    public char[] body;
    public HashMap<String, String> header;
    public HashMap<String, String> cookieParams;

	
	public RequestBuilder(InputStream input) throws IOException {
		this.input = input;
		reader = new BufferedReader(new InputStreamReader(this.input));
		build();
	}
	
	private void build() throws IOException {
		header = buildheader();
		body = buildbody();
		cookieParams = buildCookieParams();
	}
	    
	public HashMap<String, String> buildheader() throws IOException {
        HashMap<String, String> header = new HashMap<String, String>();
        String requestLine = reader.readLine();
        
        while (requestLine != null && !requestLine.trim().isEmpty()) {
            String[] split = requestLine.split(" ", 2);
            header.put(split[0], split[1]);
            requestLine = reader.readLine();
            Server.log(split[0] + " " + split[1]);
        }
                
        return header;
    }

    public char[] buildbody() throws IOException {
    	char[] body = null;
    	if (header.containsKey("Content-Length:")) {
            int contentLength = Integer.parseInt(header.get("Content-Length:"));
            body = new char[contentLength];
            int index = 0;
            
            while(contentLength != index) {
            	int value = reader.read();
            	char charValue = (char)value;
            	body[index] = charValue;
            	index = index + 1;
            }	
    	}    
		return body;
    }
    
    public HashMap<String, String> buildCookieParams() throws IOException {
    	HashMap<String, String> cookieParams = new HashMap<String, String>();
    	if (header.containsKey("Cookie:")) {
    		String[] cookieLine = header.get("Cookie:").split(";");
    		for(String param: cookieLine) {
    			String[] split = param.split("=");
    			cookieParams.put(split[0].trim(), split[1].trim());
    			Server.log(split[0] + " " + split[1]);
    		}
    	}
    	return cookieParams;
    }
}