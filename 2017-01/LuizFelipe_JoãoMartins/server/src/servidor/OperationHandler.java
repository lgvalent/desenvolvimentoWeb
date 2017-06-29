package servidor;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Iterator;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import database.Actions;

public class OperationHandler {
	Actions database = new Actions();
	
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    public static void log(String message){
    	System.out.println(dateFormat.format(Calendar.getInstance().getTime()) + " " + message);
    }
    
	public JsonObject execute(String requestBody) {
		Gson gson = new Gson();
		JsonElement element = gson.fromJson(requestBody, JsonElement.class);
		JsonObject request = element.getAsJsonObject();
		
		String operation = request.get("op").getAsString();
		//Boolean parsing = verifyJson(request);
		OperationHandler.log("[Operação] Nova operação requisitada! Identificador: " + operation);
		
		switch(operation) {
		case "add-profile":
			database.addProfile(request);
			OperationHandler.log("[Operação] Usuário adicionado com sucesso!");
			return OK_Profile();
		case "query-profile":
			JsonObject data = database.queryProfile(request);
			OperationHandler.log("[Operação] Buscando usuário cadastrado!");
			return Ok_QueryProfile(data);
		case "add-game":
			JsonObject dataGame = database.addGame(request);
			OperationHandler.log("[Operação] Game adicionado com sucesso!");
		case "add-trophy":
			//Boolean parsing = verifyParsingTrophy(request);
			database.addTrophy(request);
			OperationHandler.log("[Operação] Troféu adicionado com sucesso!");
			return OK();	
		case "get-trophy":
			OperationHandler.log("[Operação] Buscando troféu com sucesso");
			JsonObject data3 = database.getTrophy(request);
			return OK_withData(data3);
		case "list-trophy":
			OperationHandler.log("[Operação] Listando troféu com sucesso");
			JsonArray data1 = database.listTrophy(request);
			return OK_withDataArray(data1);
		case "clear-trophy":
			OperationHandler.log("[Operação] Limpando todos os troféus");
			database.clearTrophy(request);
			return OK();
		case "save-state":
			database.saveState(request);
			OperationHandler.log("[Operação] Checkpoint adicionado com sucesso");
			return OK();
		case "load-state":
			OperationHandler.log("[Operação] Checkpoing carregado com sucesso");
			JsonObject data2 = database.loadState(request);
			return OK_withData(data2);
		case "save-media":
			database.saveMedia(request);
			OperationHandler.log("[Operação] Imagem salva com sucesso");
			return OK();
		case "list-media":
			OperationHandler.log("[Operação] Listando imagens com sucesso");
			JsonArray data4 = database.listMedia(request);
			return OK_withDataArray(data4);
		case "game-over":
			OperationHandler.log("[Operação] Atualizando pontos do usuário");
			database.gameOver(request);
			return OK();
		case "list-pontos":
			OperationHandler.log("[Operação] Lista de usuarios pontuação");
			JsonArray data5 = database.listPontos(request);
			return OK_withDataArray(data5);
		default:
			return Error("not_implemented");
		}	
		
	}
	
	private JsonObject Ok_QueryProfile(JsonObject data){
		//String comparacao = data.get("response").getAsString();
		JsonObject innerObject = new JsonObject();
		int tamanho = data.size();
		if(tamanho==0){
			innerObject.addProperty("response","error");
			innerObject.addProperty("data","Usuário ou senha inválidos");
			return innerObject;
			
		}else{
			innerObject.addProperty("response","ok");
			innerObject.addProperty("data",data.toString());
			return innerObject;
		}
		
		
	}
	
	private JsonObject OK_Profile(){
		JsonObject innerObject = new JsonObject();
		innerObject.addProperty("response","ok");
		innerObject.addProperty("data","Id do usuário já existe em nossos servidores");
		return innerObject;
	} 
	
	
	private JsonObject OK_withDataArray(JsonArray data1) {
		JsonObject innerObject = new JsonObject();
		innerObject.addProperty("response","ok");
		innerObject.addProperty("data",data1.toString());
		return innerObject;
	}

	private JsonObject OK(){
		JsonObject innerObject = new JsonObject();
		innerObject.addProperty("response","ok");
		innerObject.addProperty("data","");
		return innerObject;
	}
	
	private JsonObject OK_withData(JsonObject data){
		JsonObject innerObject = new JsonObject();
		innerObject.addProperty("response","ok");
		innerObject.addProperty("data",data.toString());
		return innerObject;
	}
	
	private JsonObject Error(String reason) {
		JsonObject innerObject = new JsonObject();
		innerObject.addProperty("response","fail");
		innerObject.addProperty("data",reason);
		return innerObject;		
	}
}