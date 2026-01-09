package   com.project.block.dto;
import lombok.Data;
@Data
public class PostDTO {
    private String title;
    private String content ;
    private String mediaUrl;
    private Long userId;
}
