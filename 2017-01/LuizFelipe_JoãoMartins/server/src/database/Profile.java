package database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Profile {
	
	@Id
	@GeneratedValue
	int id;
	@Column
	String password;
	@Column
	String email;
	@Column
	String lastLogin;
	@Column
	String id_profile;

	public String getId_profile() {
		return id_profile;
	}
	public void setId_profile(String id_profile) {
		this.id_profile = id_profile;
	}
	public String getLastLogin() {
		return lastLogin;
	}
	public void setLastLogin(String lastLogin) {
		this.lastLogin = lastLogin;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	
	
}
