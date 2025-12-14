package   com.project.block.dto;
import lombok.Data;
@Data
public class PostDTO {
    private String title;
    private String content ;
    private String mediaUrl;
    public PostDTO(String title, String content, String mediaUrl) {
        this.title = title;
        this.content = content;
        this.mediaUrl = mediaUrl;
    }

}
