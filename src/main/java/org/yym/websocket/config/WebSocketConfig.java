package org.yym.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
import org.yym.websocket.handler.ChatWebSocketHandler;

@Configuration //Spring recognizes this class as a setup class.
@EnableWebSocket //Activate WebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final ChatWebSocketHandler chatWebSocketHandler; //handle actual message

    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler){
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { //WebSocket 핸들러를 등록하는 메서드이자, CORS 정책 지정가능 메서드
        registry.addHandler(chatWebSocketHandler, "/ws/chat") //엔드포인트 등록
                .setAllowedOrigins("*") // CORS for all domain
                .addInterceptors(new HttpSessionHandshakeInterceptor()); // handshake 과정에서 세션 정보를 추가가능
    }
}
