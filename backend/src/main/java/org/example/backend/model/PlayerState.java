package org.example.backend.model;

import java.io.Serializable;
import java.util.UUID;

/**
 * وضعیت هر بازیکن در یک Lobby
 */
public class PlayerState implements Serializable {

    private String userId;    // می‌تواند null باشد اگر فقط نام کاربری داشته باشیم
    private String username;
    private String role;
    private boolean alive = true;
    private boolean muted = false;
    private int votes = 0;

    /** invitation Code */
    private String inviteCode = UUID.randomUUID().toString();

    /** Avatars */
    private String avatarKey;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isAlive() { return alive; }
    public void setAlive(boolean alive) { this.alive = alive; }

    public boolean isMuted() { return muted; }
    public void setMuted(boolean muted) { this.muted = muted; }

    public int getVotes() { return votes; }
    public void setVotes(int votes) { this.votes = votes; }

    public String getInviteCode() { return inviteCode; }
    public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }

    public String getAvatarKey() { return avatarKey; }
    public void setAvatarKey(String avatarKey) { this.avatarKey = avatarKey; }
}
