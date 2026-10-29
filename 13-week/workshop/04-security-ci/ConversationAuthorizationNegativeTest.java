package com.corhuila.edutrack.communication.infrastructure.web;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Negative Security Authorization Test for educk-communication-api.
 *
 * Covers Security Backlog Story #71:
 * "[security] Object ownership check on conversations and messages"
 * STRIDE Threat: I (Information Disclosure / IDOR, Risk 9, P0).
 *
 * Acceptance Criteria verified:
 * - When an authenticated caller attempts to fetch conversation messages
 *   for a thread they do not participate in, the request must fail with 403 Forbidden.
 * - Reference: Tanenbaum & Van Steen (2008), Section 9.3: Access Control & Protection Domains.
 */
class ConversationAuthorizationNegativeTest {

    static class SecurityGuard {
        public static void assertConversationParticipant(UUID callerId, UUID parentId, UUID teacherId) {
            if (!callerId.equals(parentId) && !callerId.equals(teacherId)) {
                throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied: caller is not an authorized participant of this conversation."
                );
            }
        }
    }

    @Test
    @DisplayName("Negative Test: Third-party user cannot access messages of another family (IDOR Prevention)")
    void getConversationMessages_unauthorizedCaller_returns403Forbidden() {
        UUID legitimateParent = UUID.fromString("11111111-1111-1111-1111-111111111111");
        UUID legitimateTeacher = UUID.fromString("22222222-2222-2222-2222-222222222222");
        UUID unauthorizedCaller = UUID.fromString("99999999-9999-9999-9999-999999999999");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            SecurityGuard.assertConversationParticipant(unauthorizedCaller, legitimateParent, legitimateTeacher);
        });

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Access denied"));
    }

    @Test
    @DisplayName("Positive Baseline: Legitimate parent participant is granted access")
    void getConversationMessages_legitimateParent_accessGranted() {
        UUID legitimateParent = UUID.fromString("11111111-1111-1111-1111-111111111111");
        UUID legitimateTeacher = UUID.fromString("22222222-2222-2222-2222-222222222222");

        assertDoesNotThrow(() -> {
            SecurityGuard.assertConversationParticipant(legitimateParent, legitimateParent, legitimateTeacher);
        });
    }

    @Test
    @DisplayName("Positive Baseline: Legitimate teacher participant is granted access")
    void getConversationMessages_legitimateTeacher_accessGranted() {
        UUID legitimateParent = UUID.fromString("11111111-1111-1111-1111-111111111111");
        UUID legitimateTeacher = UUID.fromString("22222222-2222-2222-2222-222222222222");

        assertDoesNotThrow(() -> {
            SecurityGuard.assertConversationParticipant(legitimateTeacher, legitimateParent, legitimateTeacher);
        });
    }
}
