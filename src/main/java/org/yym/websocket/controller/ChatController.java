package org.yym.websocket.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    //ConcurrentHashMap to manage chatting room
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<String>> chatRooms = new ConcurrentHashMap<>();

    //create chatting room
    @PostMapping("/room")
    public ResponseEntity<String> createChatRoom(@RequestParam String roomId) {
        if (chatRooms.containsKey(roomId)) {
            return ResponseEntity.badRequest().body("Room already exists");
        }
        chatRooms.put(roomId, new CopyOnWriteArrayList<>());
        return ResponseEntity.ok().body("Room created successfully with Room ID: " + roomId);
    }

    @PostMapping("/room/{roomId}/user")
    public ResponseEntity<String> addUserToRoom(@RequestParam String userId, @RequestParam String roomId) {
        CopyOnWriteArrayList<String> users = chatRooms.get(roomId);
        if (users == null) {
            return ResponseEntity.badRequest().body("Room ID does not exist");
        }
        users.add(userId);
        return ResponseEntity.ok().body("User ID :" + userId + " added to room ID: " + roomId);
    }

    @GetMapping("/rooms")
    public ResponseEntity<ConcurrentHashMap<String, CopyOnWriteArrayList<String>>> getAllRooms() {
        return ResponseEntity.ok(chatRooms);
    }

    @PostMapping("/room/{roomId}/webrtc")
    public ResponseEntity<String> handleWebRTCSignal(@PathVariable String roomId , @RequestBody String signal) {
        System.out.println("Received webrtc signal for room: " + roomId + " : " + signal);
        return ResponseEntity.ok("WebRTC signal received");
    }
}
