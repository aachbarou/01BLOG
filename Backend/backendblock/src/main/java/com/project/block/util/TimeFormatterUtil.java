package com.project.block.util;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeFormatterUtil {

    public static String getTimeAgo(LocalDateTime past) {
        if (past == null) {
            return "";
        }
        Duration duration = Duration.between(past, LocalDateTime.now());
        long seconds = duration.getSeconds();

        if (seconds < 60)
            return seconds + "s ago";

        long minutes = seconds / 60;
        if (minutes < 60)
            return minutes + "m ago";

        long hours = minutes / 60;
        if (hours < 24)
            return hours + "h ago";

        long days = hours / 24;
        return days + "d ago";
    }
}
