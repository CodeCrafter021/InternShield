package com.internshield.backend;

import com.internshield.backend.model.Company;
import com.internshield.backend.repository.CompanyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * Loads src/main/resources/data/companies.csv into the DB on startup,
 * but ONLY when the companies table is empty (so it never overwrites your edits).
 * Columns: companyName,domain,cin,gstNumber,mcaRegistered,safetyStatus,category,sourceUrl,verifiedOn
 */
@Component
public class CompanySeeder implements CommandLineRunner {

    private final CompanyRepository repo;

    public CompanySeeder(CompanyRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() > 0) return;
        ClassPathResource res = new ClassPathResource("data/companies.csv");
        if (!res.exists()) return;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {
            String line = br.readLine(); // header
            while ((line = br.readLine()) != null) {
                if (line.isBlank() || line.startsWith("#")) continue;
                String[] c = line.split(",", -1);
                if (c.length < 9) continue;
                Company co = new Company(c[0].trim(), c[3].trim(),
                        Boolean.parseBoolean(c[4].trim()), c[5].trim());
                co.setDomain(c[1].trim());
                co.setCin(c[2].trim());
                co.setCategory(c[6].trim());
                co.setSourceUrl(c[7].trim());
                co.setVerifiedOn(c[8].trim());
                repo.save(co);
            }
        }
    }
}
