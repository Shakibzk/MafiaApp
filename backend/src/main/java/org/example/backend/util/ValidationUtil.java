package org.example.backend.util;

public class ValidationUtil {

    private ValidationUtil() {
    }

    public static boolean isValidUsername(String username) {
        if (username == null) {
            return false;
        }
        return username.matches("^[A-Za-z0-9]+$");
    }
}
