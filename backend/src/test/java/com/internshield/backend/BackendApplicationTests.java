package com.internshield.backend;

import com.internshield.backend.model.User;
import com.internshield.backend.repository.UserSessionRepository;
import com.internshield.backend.security.UserSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:internshield;DB_CLOSE_DELAY=-1",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"app.jwt.secret=test-secret-key-that-is-at-least-thirty-two-characters-long"
})
@Transactional
class BackendApplicationTests {

	@Autowired
	private UserSessionService userSessionService;

	@Autowired
	private UserSessionRepository userSessionRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void sessionCreatedAtSignInCanBeListedAndRevoked() {
		User user = new User();
		user.setEmail("session-test@example.com");
		user.setName("Session Test");
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("User-Agent", "Test Browser");

		Map<String, Object> created = userSessionService.create(user, request);
		String sessionId = (String) created.get("sessionId");
		List<Map<String, Object>> active = userSessionService.list(user.getEmail(), sessionId);

		assertEquals(1, active.size());
		assertTrue((Boolean) active.getFirst().get("current"));
		assertEquals("Test Browser", active.getFirst().get("device"));
		assertTrue(userSessionService.revoke(user.getEmail(), sessionId));
		assertFalse(userSessionService.touch(sessionId, user.getEmail()));
		assertTrue(userSessionService.list(user.getEmail(), sessionId).isEmpty());
		userSessionRepository.deleteByEmail(user.getEmail());
	}

}
