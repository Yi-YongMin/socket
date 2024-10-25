package org.yym.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
    }

    private MessageType type;
    private String content;
    private String sender;
    private String recipient;

}
