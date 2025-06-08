package org.cs127.pos.errorhandling;

public class MemberAlreadyExistsException extends RuntimeException {
    public MemberAlreadyExistsException(String message) {
        super(message);
    }

    public MemberAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public MemberAlreadyExistsException(String field, String value, String memberId) {
        super(String.format("%s '%s' is already registered to member %s",
                field, value, memberId));
    }
}
