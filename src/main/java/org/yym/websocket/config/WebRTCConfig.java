package org.yym.websocket.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

//TURN / STUN server setting

//Traversal Using Relays around NAT -> 멀티미디어 애플리케이션을 위해 네트워크 주소 변환 또는 방화벽에서 보조하는 프로토콜

//Session Traversal Utilities for NAT -> 실시간 음성, 비디오, 메시징 애플리케이션, 그리고 기타 상호작용 통신 부문에서
// 네트워크 주소 변환 게이트웨이의 트레버설을 위한, 네트워크 프로토콜을 포함하는 메소드들의 표준화된 모임
@Configuration
public class WebRTCConfig {
    @Value("${webrtc.turn.server.url}")
    private String turnServerUrl;

    @Value("${webrtc.turn.server.username}")
    private String turnServerUsername;

    @Value("${webrtc.turn.server.password}")
    private String turnServerPassword;

    @Value("${webrtc.stun.server.url}")
    private String stunServerUrl;

    @Bean
    public Map<String,Object> turnServerConfig(){
        Map<String,Object> turnConfig = new HashMap<>();
        turnConfig.put("url", turnServerUrl);
        turnConfig.put("username", turnServerUsername);
        turnConfig.put("credential", turnServerPassword); //credential 자격 증명
        return turnConfig;
    }

    @Bean
    public Map<String,Object> stunServerConfig(){
        Map<String,Object> stunConfig = new HashMap<>();
        stunConfig.put("url", stunServerUrl);
        return stunConfig;
    }

// spring이 순환참조를 해버리기 때문에 문제 발생하는 코드. 없어도 서버가 정상동작하지만,
// 클라이언트쪽에서 정보를 직접 설정하거나 REST API를 통해 서버에서 필요한 정보를 받아와야함.
//    @Bean
//    public Map<String,Object> webRTCConfig(){
//        Map<String,Object> webRTCConfig = new HashMap<>();
//        webRTCConfig.put("iceServers", new Map[]{turnServerConfig(), stunServerConfig()});
//        return webRTCConfig;
//    }
}
