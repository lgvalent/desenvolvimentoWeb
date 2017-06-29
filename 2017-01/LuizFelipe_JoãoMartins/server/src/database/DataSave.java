package database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Entity
public class DataSave {
	
	@Id
	@GeneratedValue
	int id;
	@Column
	int posX;
	@Column
	int posY;
	@Column
	String id_profile;
	
	
	public String getId_profile() {
		return id_profile;
	}
	public void setId_profile(String id_profile) {
		this.id_profile = id_profile;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPosX() {
		return posX;
	}
	public void setPosX(int posX) {
		this.posX = posX;
	}
	public int getPosY() {
		return posY;
	}
	public void setPosY(int posY) {
		this.posY = posY;
	}
	
	

}
