package database;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Actions {
	EntityManagerFactory factory = Persistence.createEntityManagerFactory("gameserver");
	EntityManager manager = factory.createEntityManager();
	DataTrophy dataTrophy = new DataTrophy();
	DataSave dataSave = new DataSave();
	DataMedia dataMedia = new DataMedia();
	Profile dataProfile = new Profile();
	DataGame dataGame = new DataGame();
	Gson gson = new Gson();
	ProfilePontos dataProfilePontos = new ProfilePontos();
	
	/*DataFriendsServers dataFriendsServers = new DataFriendsServers();
	
	public void addFriendsIps(String[] friendServers){
		int tamFriendServers = friendServers.length;
		
    	for(int i = 0; i < tamFriendServers;i++){
    		System.out.println(friendServers[i]);
    		dataFriendsServers.setFriendIp(friendServers[i]);
    		manager.getTransaction().begin();
    		manager.persist(dataFriendsServers);
    		manager.getTransaction().commit();
    		
    	}
	}*/
	
	public void addProfile(JsonObject json){
		System.out.println(json);
		String id = json.get("id").getAsString();
		JsonObject jsonProfile = json.getAsJsonObject("data");
		String password = jsonProfile.get("password").getAsString();
		String email = jsonProfile.get("email").getAsString();
		//String pontos = jsonProfile.get("pontos").getAsString();
		//dataProfile.setId(id);
		dataProfile.setId_profile(id);
		dataProfile.setPassword(password);
		dataProfile.setEmail(email);
		dataProfile.setLastLogin(jsonProfile.get("lastLogin").getAsString());
		manager.getTransaction().begin();
		manager.persist(dataProfile);
		manager.getTransaction().commit();
	}
	
	//adicionar um campo source na qual vem o ip do servidor no data (JSON)
	public JsonObject queryProfile(JsonObject json){
		String id = json.get("id").getAsString();
		JsonObject jsonQuery = json.getAsJsonObject("data");
		String password = jsonQuery.get("password").getAsString();
		//existe usuario com aquela senha
		//List<Profile> query = (List<Profile>) manager.createQuery("FROM Profile WHERE id_profile = :busca AND password = :password").setParameter("busca", id).setParameter("password", password).getResultList();
		JsonObject innerObject = new JsonObject();
		Query query = manager.createQuery("select p.lastLogin,p.email from Profile p WHERE p.id_profile = :busca AND p.password = :password").setParameter("busca", id).setParameter("password", password);
		List<Object[]> rows = query.getResultList();
		if(rows.isEmpty()){
			return innerObject;
		}else{
			JsonObject innerObject1 = new JsonObject();
			for (Object[] row: rows) {
				innerObject1.addProperty("lastLogin",(String) row[0]);
				innerObject1.addProperty("email",(String) row[1]);
			}
			return innerObject1;
		}
	}
	
	public JsonObject addGame(JsonObject json){
		String id = json.get("id").getAsString();
		JsonObject returnJson = new JsonObject();
		JsonObject returnJsonok1 = new JsonObject();
		List<Profile> query = (List<Profile>) manager.createQuery("password from Profile where id_profile = :busca").setParameter("busca", id).getResultList();
		if(query.isEmpty()){
			returnJson.addProperty("response","error");
			returnJson.addProperty("data", "Usuário não existente");
			return returnJson;
		}else{
			String idGame = json.get("game").getAsString();
			JsonObject jsonObject = json.getAsJsonObject("data");
			//dataGame.setId(idGame);
			dataGame.setName(jsonObject.get("name").getAsString());
			dataGame.setDescription(jsonObject.get("description").getAsString());
			dataGame.setId_Profile(id);
			manager.getTransaction().begin();
			manager.persist(dataGame);
			manager.getTransaction().commit();
			returnJsonok1.addProperty("response", "ok1");
			returnJsonok1.addProperty("data", "Jogo adicionado com sucesso ao Usuário");
			return returnJsonok1;
		}
		
	}

	public void addTrophy(JsonObject json) {
		String id_profile = json.get("id").getAsString();
		JsonObject jsonData = json.getAsJsonObject("data");
		//dataTrophy = gson.fromJson(jsonData, DataTrophy.class);
		//dataTrophy.setId(id_profile);
		dataTrophy.setDescription(jsonData.get("description").getAsString());
		dataTrophy.setName(jsonData.get("name").getAsString());
		dataTrophy.setTitle(jsonData.get("title").getAsString());
		dataTrophy.setXp(jsonData.get("xp").getAsInt());
		dataTrophy.setId_profile(id_profile);
		manager.getTransaction().begin();
		manager.persist(dataTrophy);
		manager.getTransaction().commit();
	}
	
	@SuppressWarnings("unchecked")
	public JsonObject getTrophy (JsonObject json) {
		/* Faça toda a lógica do listTrophy */
		/* Não se esqueça que o listTrophy é um array de JsonObjects, ver na documentação Gson como faz... */
		String id_profile = json.get("id").getAsString();
		String id_game = json.get("game").getAsString();
		String data = json.get("data").getAsString();
		manager.getTransaction().begin();
		JsonObject innerObject = new JsonObject();
		List<DataTrophy> query = (List<DataTrophy>) manager.createQuery("from DataTrophy where id_profile = :busca").setParameter("busca", id_profile).getResultList();
		for ( DataTrophy dataTrophy : query ) {
			innerObject.addProperty("name",dataTrophy.getName());
			innerObject.addProperty("xp",dataTrophy.getXp());
			innerObject.addProperty("title",dataTrophy.getTitle());
			innerObject.addProperty("description",dataTrophy.getDescription());
		}
		return innerObject;
	}
	
	public JsonArray listTrophy (JsonObject json) {
		JsonArray saidaFinal = new JsonArray();
		String id_profile = json.get("id").getAsString();
		manager.getTransaction().begin();
		List<DataTrophy> queryList = (List<DataTrophy>) manager.createQuery("from DataTrophy where id_profile = :busca").setParameter("busca", id_profile).getResultList();
		for(DataTrophy dataTrophy: queryList){
			JsonObject resultado = new JsonObject();
			resultado.addProperty("name", dataTrophy.getName());
			resultado.addProperty("xp", dataTrophy.getXp());
			resultado.addProperty("title", dataTrophy.getTitle());
			resultado.addProperty("description", dataTrophy.getDescription());
			saidaFinal.add(resultado);
		}
		return saidaFinal;
	}
	
	public void clearTrophy(JsonObject json){
		manager.getTransaction().begin();
		manager.createQuery("delete from DataTrophy").executeUpdate();
		manager.getTransaction().commit();
		
	}
	
	public void saveState(JsonObject json) {
		String id_profile = json.get("id").getAsString();
		JsonObject jsonData = json.getAsJsonObject("data");
		//dataSave = gson.fromJson(jsonData, DataSave.class);
		//dataSave.setId(id_profile);
		dataSave.setId_profile(id_profile);
		dataSave.setPosX(jsonData.get("x").getAsInt());
		dataSave.setPosY(jsonData.get("y").getAsInt());
		manager.getTransaction().begin();
		manager.persist(dataSave);
		manager.getTransaction().commit();
	}
	
	public JsonObject loadState (JsonObject json) {
		JsonObject saida = new JsonObject();
		String id_profile = json.get("id").getAsString();
		manager.getTransaction().begin();
		List<DataSave> querySave = (List<DataSave>) manager.createQuery("from DataSave where id_profile = :busca").setParameter("busca", id_profile).getResultList();
		for(DataSave dataSave : querySave){
			saida.addProperty("x", dataSave.getPosX());
			saida.addProperty("y", dataSave.getPosY());
		}
		return saida;
	}
	
	//Salvei como string, depois só modificar para o formato no hibernate
	public void saveMedia(JsonObject json){
		JsonObject jsonDataMedia = json.getAsJsonObject("data");
		String id_profile = json.get("id").getAsString();
		//dataMedia = gson.fromJson(jsonDataMedia, DataMedia.class);
		//dataMedia.setId(id_profile);
		dataMedia.setMimeType(jsonDataMedia.get("mimeType").getAsString());
		dataMedia.setSrc(jsonDataMedia.get("src").getAsString());
		dataMedia.setId_profile(id_profile);
		manager.getTransaction().begin();
		manager.persist(dataMedia);
		manager.getTransaction().commit();
	}
	
	public JsonArray listMedia (JsonObject json){
		JsonArray resultFinal = new JsonArray();
		String id_profile = json.get("id").getAsString();
		manager.getTransaction().begin();
		List<DataMedia> query = (List<DataMedia>) manager.createQuery("from DataMedia where id_profile = :busca").setParameter("busca", id_profile).getResultList();
		for(DataMedia dataMedia: query){
			JsonObject result = new JsonObject();
			result.addProperty("mimeType", dataMedia.getMimeType());
			result.addProperty("src", dataMedia.getSrc());
			resultFinal.add(result);
		}
		return resultFinal;
	}
	
	public void gameOver(JsonObject json){		
		String id = json.get("id").getAsString();
		List<ProfilePontos> query = (List<ProfilePontos>) manager.createQuery("from ProfilePontos where id_profile = :busca").setParameter("busca", id).getResultList();
		String pontos = json.get("data").getAsString();
		//System.out.println(query);
		if(query.isEmpty()){
			dataProfilePontos.setId_profile(id);
			dataProfilePontos.setPontos(pontos);
			//dataProfilePontos = gson.fromJson(jsonGameOver, ProfilePontos.class);
			manager.getTransaction().begin();
			manager.persist(dataProfilePontos);
			manager.getTransaction().commit();
		}else{
			manager.getTransaction().begin();
			//String qryString = "update ProfilePontos p set p.pontos=:pontos where p.id_profile=:busca";
			Query query1 = manager.createQuery("update ProfilePontos set pontos=:pontos where id_profile=:busca");
			query1.setParameter("pontos", pontos);
			query1.setParameter("busca", id);
			query1.executeUpdate();
			manager.getTransaction().commit();
			
		}
		
	}
	
	public JsonArray listPontos(JsonObject json){
		JsonArray resultPontos = new JsonArray();
		manager.getTransaction().begin();
		List<ProfilePontos> query = (List<ProfilePontos>) manager.createQuery("from ProfilePontos",ProfilePontos.class).getResultList();
		for(ProfilePontos profilePontos: query){
			JsonObject result = new JsonObject();
			result.addProperty("id", profilePontos.getId_profile());
			result.addProperty("pontos", profilePontos.getPontos());
			resultPontos.add(result);
		}
		return resultPontos;
		
	}
	
  }