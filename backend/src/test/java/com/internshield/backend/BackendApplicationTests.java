package com.internshield.backend;

import com.internshield.backend.controller.AccountSecurityController;
import com.internshield.backend.model.CommunityAlert;
import com.internshield.backend.model.Company;
import com.internshield.backend.model.ScamReport;
import com.internshield.backend.model.ThreatTelemetry;
import com.internshield.backend.model.User;
import com.internshield.backend.repository.CommunityAlertRepository;
import com.internshield.backend.repository.CompanyRepository;
import com.internshield.backend.repository.ScamReportRepository;
import com.internshield.backend.repository.ThreatTelemetryRepository;
import com.internshield.backend.repository.UserSessionRepository;
import com.internshield.backend.repository.UserRepository;
import com.internshield.backend.security.ThreatReportService;
import com.internshield.backend.security.ThreatTelemetryService;
import com.internshield.backend.security.UserSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.mock.web.MockHttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;

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

	@Autowired
	private AccountSecurityController accountSecurityController;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CommunityAlertRepository communityAlertRepository;

	@Autowired
	private CompanyRepository companyRepository;

	@Autowired
	private ScamReportRepository scamReportRepository;

	@Autowired
	private ThreatReportService threatReportService;

	@Autowired
	private ThreatTelemetryService threatTelemetryService;

	@Autowired
	private ThreatTelemetryRepository threatTelemetryRepository;

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

	@Test
	void accountPreferencesPersistAndOldTelemetryDefaultsRequireExplicitConsent() {
		User user = new User();
		user.setEmail("settings-test@example.com");
		user.setSettingsJson("{\"telemetrySharing\":true}");
		userRepository.save(user);
		Authentication authentication = authenticationFor(user.getEmail());

		Map<?, ?> initial = (Map<?, ?>) accountSecurityController.getSettings(authentication).getBody();
		assertFalse((Boolean) initial.get("telemetrySharing"));

		accountSecurityController.updateSettings(authentication,
				Map.of("telemetrySharing", true, "communityAlerts", false));
		Map<?, ?> saved = (Map<?, ?>) accountSecurityController.getSettings(authentication).getBody();

		assertTrue((Boolean) saved.get("telemetrySharing"));
		assertFalse((Boolean) saved.get("communityAlerts"));
		assertTrue(((List<?>) accountSecurityController.communityAlerts(authentication).getBody()).isEmpty());
	}

	@Test
	void communityReportCreatesAnInAppAlertAndRaisesCriticalCompanyStatusAtThreshold() {
		Company company = new Company();
		company.setCompanyName("Report Threshold Test");
		company.setSafetyStatus("Yellow");
		companyRepository.save(company);

		for (int i = 0; i < 4; i++) {
			ScamReport existing = new ScamReport();
			existing.setCompanyId(company.getId());
			existing.setCompanyName(company.getCompanyName());
			existing.setScamType("Previous report");
			scamReportRepository.save(existing);
		}

		ScamReport report = new ScamReport();
		report.setCompanyName(company.getCompanyName());
		report.setScamType("Community report");
		report.setDescription("Requests an upfront fee.");
		ScamReport saved = threatReportService.submit(report);

		assertEquals(company.getId(), saved.getCompanyId());
		assertEquals(5, scamReportRepository.countByCompanyId(company.getId()));
		assertEquals("Red", companyRepository.findById(company.getId()).orElseThrow().getSafetyStatus());
		List<CommunityAlert> alerts = communityAlertRepository.findAllByOrderByCreatedAtDesc();
		assertEquals(1, alerts.size());
		assertEquals("Anonymous Student", alerts.getFirst().getReporter());
	}

	@Test
	void anonymousTelemetryAggregatesOnlyAllowedRiskCategories() {
		User user = new User();
		user.setEmail("telemetry-test@example.com");
		user.setSettingsJson("{\"telemetrySharing\":true}");
		userRepository.save(user);

		threatTelemetryService.record(user.getEmail(), "HIGH");
		assertTrue(threatTelemetryRepository.findById("HIGH").isEmpty());

		user.setTelemetryConsentVersion(1);
		userRepository.save(user);
		threatTelemetryService.record(user.getEmail(), "high");
		threatTelemetryService.record(user.getEmail(), "HIGH");

		ThreatTelemetry aggregate = threatTelemetryRepository.findById("HIGH").orElseThrow();
		assertEquals(2, aggregate.getEventCount());
		user.setSettingsJson("{\"telemetrySharing\":true,\"incognitoVerification\":true}");
		userRepository.save(user);
		threatTelemetryService.record(user.getEmail(), "HIGH");
		assertEquals(2, threatTelemetryRepository.findById("HIGH").orElseThrow().getEventCount());
		org.junit.jupiter.api.Assertions.assertThrows(
				IllegalArgumentException.class,
				() -> threatTelemetryService.record(user.getEmail(), "COMPANY_NAME"));
	}

	private static Authentication authenticationFor(String email) {
		return new UsernamePasswordAuthenticationToken(email, null, Set.of());
	}

}
