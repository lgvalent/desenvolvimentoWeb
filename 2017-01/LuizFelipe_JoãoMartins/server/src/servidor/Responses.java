package servidor;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.gson.JsonObject;

public class Responses {
	String localHost;
	
	public Responses(String localHost) {
		this.localHost = localHost;
	}
	
    public byte[] responseJSON_Success(JsonObject response) throws IOException {
        String responseHeader = "HTTP/1.1 200 OK\n"
        		+ "\n"
                + response;
        return responseHeader.getBytes();
    }
    
    public byte[] response404_NotFound(String resource) throws IOException {
        String responseHeader = "HTTP/1.1 404 Not found\n"
                + "\n"
        		+ "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"><html><head><title>"
                + "404 Not Found"
        		+ "</title></head><body><h1>Not Found</h1><p>The requested URL "
                + resource
                + " was not found on this Servidor.</p><hr><address>"
                + "Game Server [Primeira entrega] | "
                + localHost
                + "</address></body></html>";
        return responseHeader.getBytes();
    }

    public byte[] response401_NotAuthorized() throws IOException {
        String responseHeader = "HTTP/1.1 401 Not Authorized\n"
                + "WWW-Authenticate: Basic realm=\"Entre com usuário e senha\"\n"
                + "\n"
                + "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"><html><head><title>"
                + "401 Not Authorized"
        		+ "</title></head><body><h1>Not Authorized</h1><p>The requested URL "
                + " was under security constraint.</p><hr><address>"
                + "Game Server [Primeira entrega] | "
                + localHost
                + "</address></body></html>";
        return responseHeader.getBytes();        
    }

    public byte[] response501_NotImplemented() throws IOException {
        String responseHeader = "HTTP/1.1 501 Not implemented\n"
                + "\n"
                + "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"><html><head><title>"
                + "501 Not implemented"
        		+ "</title></head><body><h1>Not implemented</h1><p>The requested URL "
                +" was under security constraint.</p><hr><address>"
                + "Game Server [Primeira entrega] | "
                + localHost
                +"</address></body></html>";
        return responseHeader.getBytes();
    }

    public byte[] response400_BadRequest() throws IOException {
        String responseHeader = "HTTP/1.1 400 Bad Request\n"
        		+ "\n"
        		+ "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"><html><head><title>"
        		+ "400 Bad Request"
        		+ "</title></head><body><h1>Bad Request</h1><p>The requested URL "
        		+" was under security constraint.</p><hr><address>"
        		+ "Game Server [Primeira entrega] | "
        		+ localHost
        		+"</address></body></html>";
        return responseHeader.getBytes();
    }

	public byte[] responseGame(String rootFolder, String request) throws Exception {
		File file = new File(rootFolder + request);
		if(file.exists()){
			String contentType = contentType(file.getName());
	        byte[] content;
	        if (!contentType.equals("text/html")) {
	            content = sendBytes(new FileInputStream(file));
	        } else {
	            content = processDynamicHtml(new FileReader(file));
	        }

	        String responseHeader = "HTTP/1.1 200 OK\n"
	                + "Content-Length: " + content.length + "\n"
	                + "Content-Type: " + contentType + "\n"
	                +"\n";

	        ByteArrayOutputStream result =  new ByteArrayOutputStream();
	        result.write(responseHeader.getBytes());
	        result.write(content);
	        return  result.toByteArray();
		}
		else {
			System.out.println("Um arquivo inexistente foi requisitado!");
			return null;
		}
	}
	
    private byte[] processDynamicHtml(FileReader reader) {
        try {
            StringBuffer stringBuffer = new StringBuffer();
            int c = reader.read();
            while (c != -1) {
                stringBuffer.append((char) c);
                c = reader.read();
            }

            String content = stringBuffer.toString();
            Pattern p = Pattern.compile("<%.*?%>"); 
            Matcher m = p.matcher(content);
            while (m.find()) {
                String script = m.group(); 
                String scriptOut = compileScript(script);
                content = content.replaceFirst(script, scriptOut);
            }
            return content.getBytes();

        } catch (IOException ex) {
            return null;
        }
    }
    
    private static byte[] sendBytes(FileInputStream fis)
            throws Exception {
        byte[] buffer = new byte[1024];
        int bytes = 0;

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        while ((bytes = fis.read(buffer)) != -1) {
            stream.write(buffer, 0, bytes);
        }
        stream.flush();
        return stream.toByteArray();
    }
    
    private static String contentType(String fileName) {
        if (fileName.endsWith(".htm") || fileName.endsWith(".html")) {
            return "text/html";
        }
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (fileName.endsWith(".png")) {
            return "image/png";
        }
        if (fileName.endsWith(".mp3")) {
            return "audio/mpeg3";
        }
        if (fileName.endsWith(".xml")) {
            return "application/xml";
        }
        if (fileName.endsWith(".css")) {
            return "text/css";
        }      
        if (fileName.endsWith(".gif")) {
            return "image/gif";
        }
        if (fileName.endsWith(".txt")) {
            return "text/plain";
        }
        if (fileName.endsWith(".pdf")) {
            return "application/pdf";
        }
        if (fileName.endsWith(".json")) {
        	return "application/json";
        }
        return "application/octet-stream";
    }
    
    private String compileScript(String source) {
        source = source.substring(2, source.length() - 2);
        String out = "";
        String[] statements = source.split(";");
        for (int i = 0; i < statements.length; i++) {
            String stm = statements[i].trim();
            String result = "";
            if (stm.equals("now")) {
                result = Calendar.getInstance().getTime().toString();

            } else if (stm.startsWith("host")) {
                result = System.getProperty("os.name");

            } else if (stm.startsWith("sysinfo")) {
                Properties prop = System.getProperties();
                Enumeration<?> e = prop.propertyNames();
                while (e.hasMoreElements()) {
                    String key = (String) e.nextElement();
                    result += (key + ": " + prop.getProperty(key)) + "<br />";
                }
            }
            out += result;
        }
        return out;
    }
    
}