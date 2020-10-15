import java.io.*;
import java.net.*;

public class Courses {
	
	public static void main(String[] args) {
		try {
			URL url = new URL("https://www.fit.vut.cz/study/courses/");
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			
			BufferedReader in = new BufferedReader(
					  new InputStreamReader(con.getInputStream()));
			
			String line;
			while ((line = in.readLine()) != null) {
			    if (line.contains("list-links__link")) {
			    	line = line.replaceAll("<[^<>]*>", ";");
			    	line = line.replaceAll(";;*", ";");
			    	System.out.println(line);
			    }
			}
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
