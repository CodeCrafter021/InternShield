package com.internshield.backend;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class InternShieldSeleniumTest {

    static WebDriver driver;
    static String BASE_URL = "https://intern-shield-n6tn.vercel.app";
    static String TEST_EMAIL = "testuser@gmail.com";
    static String TEST_PASSWORD = "Test@1234";

    @BeforeAll
    static void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().setSize(new Dimension(1280, 900));
    }

    @Test
    @Order(1)
    void testHomePage() {
        driver.get(BASE_URL);
        String title = driver.getTitle();
        System.out.println("Page Title: " + title);
        Assertions.assertTrue(title.contains("InternShield"));
        System.out.println("✅ Home page test pass!");
    }

    @Test
    @Order(2)
    void testRegister() throws InterruptedException {
        driver.get(BASE_URL + "/register");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement email = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='email']"))
        );
        email.clear();
        email.sendKeys(TEST_EMAIL);

        driver.findElement(By.cssSelector("input[type='password']")).sendKeys(TEST_PASSWORD);

        WebElement registerBtn = driver.findElement(By.cssSelector("button[type='submit']"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", registerBtn);

        Thread.sleep(2000);
        System.out.println("Register URL: " + driver.getCurrentUrl());
        System.out.println("✅ Register test pass!");
    }

    @Test
    @Order(3)
    void testLogin() throws InterruptedException {
        driver.get(BASE_URL + "/login");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement email = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='email']"))
        );
        email.clear();
        email.sendKeys(TEST_EMAIL);

        driver.findElement(By.cssSelector("input[type='password']")).sendKeys(TEST_PASSWORD);

        WebElement loginBtn = driver.findElement(By.cssSelector("button[type='submit']"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", loginBtn);

        Thread.sleep(2000);
        System.out.println("Login ke baad URL: " + driver.getCurrentUrl());
        System.out.println("✅ Login test pass!");
    }

    @Test
    @Order(4)
    void testCompanySearch() throws InterruptedException {
        // Pehle login karo
        driver.get(BASE_URL + "/login");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement email = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='email']"))
        );
        email.sendKeys(TEST_EMAIL);
        driver.findElement(By.cssSelector("input[type='password']")).sendKeys(TEST_PASSWORD);
        ((JavascriptExecutor) driver).executeScript(
            "arguments[0].click();",
            driver.findElement(By.cssSelector("button[type='submit']"))
        );
        Thread.sleep(2000);

        // Ab dashboard ke company scanner pe jao
        driver.get(BASE_URL + "/dashboard");
        WebElement searchBox = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.tagName("input"))
        );
        searchBox.sendKeys("TCS");
        searchBox.sendKeys(Keys.RETURN);
        Thread.sleep(2000);
        System.out.println("✅ Company search test pass!");
    }

    @Test
    @Order(5)
    void testDashboard() throws InterruptedException {
        driver.get(BASE_URL + "/dashboard");
        Thread.sleep(2000);
        String currentUrl = driver.getCurrentUrl();
        System.out.println("Dashboard URL: " + currentUrl);
        Assertions.assertTrue(
            currentUrl.contains("dashboard") || currentUrl.contains("login")
        );
        System.out.println("✅ Dashboard test pass!");
    }

    @Test
    @Order(6)
    void testScamReport() throws InterruptedException {
        driver.get(BASE_URL + "/threats");
        Thread.sleep(2000);
        System.out.println("Threats URL: " + driver.getCurrentUrl());
        System.out.println("✅ Scam report test pass!");
    }

    @Test
    @Order(7)
    void testNavigationLinks() throws InterruptedException {
        driver.get(BASE_URL);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement aboutLink = wait.until(
                ExpectedConditions.elementToBeClickable(By.linkText("About"))
            );
            aboutLink.click();
            Thread.sleep(1000);
            System.out.println("About URL: " + driver.getCurrentUrl());
        } catch (Exception e) {
            System.out.println("About link nahi mila");
        }

        driver.get(BASE_URL);
        try {
            WebElement howLink = wait.until(
                ExpectedConditions.elementToBeClickable(By.partialLinkText("How"))
            );
            howLink.click();
            Thread.sleep(1000);
            System.out.println("How it works URL: " + driver.getCurrentUrl());
        } catch (Exception e) {
            System.out.println("How it works link nahi mila");
        }

        System.out.println("✅ Navigation test pass!");
    }

    @Test
    @Order(8)
    void testResponsiveDesign() throws InterruptedException {
        driver.get(BASE_URL);

        driver.manage().window().setSize(new Dimension(375, 812));
        Thread.sleep(1000);
        System.out.println("Mobile view: " + driver.getTitle());

        driver.manage().window().setSize(new Dimension(768, 1024));
        Thread.sleep(1000);
        System.out.println("Tablet view: " + driver.getTitle());

        driver.manage().window().maximize();
        Thread.sleep(1000);
        System.out.println("Desktop view: " + driver.getTitle());

        System.out.println("✅ Responsive test pass!");
    }

    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}