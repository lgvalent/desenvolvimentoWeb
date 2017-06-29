package database;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

public class DataGame {
	
	@Id
	@GeneratedValue
	int id;
	
	@Column
	String name;
	
	@Column
	String description;
	
	@Column
	String id_Profile;
	
	
	public String getId_Profile() {
		return id_Profile;
	}

	public void setId_Profile(String id_Profile) {
		this.id_Profile = id_Profile;
	}

	public int getId() {
		return id;
	}

	public void setId(int idGame) {
		this.id = idGame;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	
}
