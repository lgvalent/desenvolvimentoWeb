package database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class DataFriendsServers {

	@Id
	@GeneratedValue
	int id;
	
	@Column
	String friendIp;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFriendIp() {
		return friendIp;
	}

	public void setFriendIp(String friendIp) {
		this.friendIp = friendIp;
	}
	
	
}
