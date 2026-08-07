# KAY Dental Care - Full Stack Website

A comprehensive dental clinic website for KAY Dental Care based in Yangon, Myanmar.

## 🏗️ Project Structure

```
kay-dental-care/
├── kay-dental-web/          # Frontend (Vite + React + TypeScript) - THIS PROJECT
└── kay-dental-api/          # Backend (Spring Boot + PostgreSQL) - SEPARATE PROJECT
```

---

## 🖥️ Frontend (This Project)

### Tech Stack
- **Vite 5.x** - Build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Router v6** - Routing (HashRouter for SPA)
- **Zustand** - State management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Swiper.js** - Carousels
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Features
- ✅ Responsive design (mobile-first)
- ✅ Bilingual support (English/Myanmar)
- ✅ Public pages (Home, Services, Doctors, Gallery, etc.)
- ✅ Multi-step appointment booking
- ✅ Admin panel with authentication
- ✅ Real-time clinic status (Open/Closed/Holiday)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8080/api
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your-cloud-name
```

### URLs (with HashRouter)
- Home: `/#/`
- Admin Login: `/#/admin/login`
- Admin Dashboard: `/#/admin`
- Services: `/#/services`
- Book Appointment: `/#/appointment`

### Demo Credentials (Mock Mode)
- **Username:** `admin`
- **Password:** `admin123`

---

## ⚙️ Backend Setup (Spring Boot)

The frontend is ready to connect to a Spring Boot backend. Follow these instructions to set it up.

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+
- (Optional) Cloudinary account for image uploads

### Step 1: Create the Spring Boot Project

Using Spring Initializr (https://start.spring.io/) or your IDE, create a new project with:

- **Project:** Maven
- **Language:** Java
- **Spring Boot:** 3.2.x
- **Group:** com.kaydental
- **Artifact:** kay-dental-api
- **Package:** com.kaydental
- **Java:** 17

**Dependencies to add:**
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- PostgreSQL Driver
- Lombok
- Spring Boot DevTools

### Step 2: Add Additional Dependencies to pom.xml

```xml
<!-- Flyway for migrations -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- Swagger/OpenAPI -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>

<!-- Cloudinary (optional - for image uploads) -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

### Step 3: Configure application.properties

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/kay_dental
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JWT
jwt.secret=your-256-bit-secret-key-here-minimum-32-characters
jwt.access-token-expiration=3600000
jwt.refresh-token-expiration=604800000

# CORS - Allow frontend origin
cors.allowed-origins=http://localhost:5173

# Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

### Step 4: Create PostgreSQL Database

```sql
CREATE DATABASE kay_dental;
```

### Step 5: Configure CORS

Create `CorsConfig.java`:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins.split(","))
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

### Step 6: Configure Security

Create `SecurityConfig.java`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/banners/**").permitAll()
                .requestMatchers("/api/doctors/**").permitAll()
                .requestMatchers("/api/services/**").permitAll()
                .requestMatchers("/api/gallery/**").permitAll()
                .requestMatchers("/api/testimonials/**").permitAll()
                .requestMatchers("/api/faqs/**").permitAll()
                .requestMatchers("/api/clinic/**").permitAll()
                .requestMatchers("/api/holidays/**").permitAll()
                .requestMatchers("/api/appointments").permitAll()
                .requestMatchers("/api/appointments/track").permitAll()
                .requestMatchers("/api/appointments/available-slots").permitAll()
                .requestMatchers("/api/contact").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()
                // Admin endpoints require authentication
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Step 7: Create Flyway Migrations

Create migration files in `src/main/resources/db/migration/`:

**V1__create_users_table.sql**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

**V12__seed_initial_data.sql** (example)
```sql
-- Admin user (password: admin123)
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c7rnuF4Yf4G8/3Kn2y', 'admin@kaydental.com', 'ADMIN');

-- Add your seed data for services, doctors, etc.
```

### Step 8: API Response Format

The frontend expects this response format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

### Step 9: Run the Backend

```bash
cd kay-dental-api
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`
Swagger UI at `http://localhost:8080/swagger-ui.html`

---

## 🔗 Connecting Frontend to Backend

### 1. Update Environment Variable

In the frontend project, create/update `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

### 2. Switch from Mock Data to API

The frontend currently uses mock data in `src/data/mockData.ts`. To switch to the real API:

1. The API layer is already set up in `src/api/`:
   - `axiosInstance.ts` - Configured Axios with auth interceptors
   - `publicApi.ts` - Public API endpoints
   - `adminApi.ts` - Admin API endpoints
   - `authApi.ts` - Authentication endpoints

2. Update components to use API instead of mock data. Example:

```typescript
// Before (mock data)
import { mockDoctors } from '@/data/mockData';
const doctors = mockDoctors;

// After (real API)
import { doctorApi } from '@/api/publicApi';
const [doctors, setDoctors] = useState<Doctor[]>([]);
useEffect(() => {
  doctorApi.getAll().then(setDoctors);
}, []);
```

3. Update auth store to use real API:

```typescript
// In useAuthStore.ts, update login function to call authApi
import { authApi } from '@/api/authApi';

login: async (username: string, password: string) => {
  try {
    const response = await authApi.login({ username, password });
    localStorage.setItem('kay-dental-token', response.data.accessToken);
    set({
      isAuthenticated: true,
      user: response.data.user,
      token: response.data.accessToken,
    });
    return true;
  } catch (error) {
    return false;
  }
},
```

---

## 📋 API Endpoints Reference

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/banners/active` | Get active banners |
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/{id}` | Get doctor by ID |
| GET | `/api/services` | Get all services |
| GET | `/api/services/{slug}` | Get service by slug |
| GET | `/api/gallery` | Get gallery photos |
| GET | `/api/testimonials` | Get testimonials |
| GET | `/api/faqs` | Get FAQs |
| GET | `/api/clinic/settings` | Get clinic settings |
| GET | `/api/clinic/status` | Get clinic open/closed status |
| GET | `/api/holidays/active` | Get current holiday |
| POST | `/api/appointments` | Create appointment |
| POST | `/api/contact` | Send contact message |

### Admin Endpoints (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET/POST/PUT/DELETE | `/api/admin/banners` | Manage banners |
| GET/POST/PUT/DELETE | `/api/admin/appointments` | Manage appointments |
| GET/POST/PUT/DELETE | `/api/admin/doctors` | Manage doctors |
| GET/POST/PUT/DELETE | `/api/admin/services` | Manage services |
| GET/POST/PUT/DELETE | `/api/admin/holidays` | Manage holidays |
| GET/POST/PUT/DELETE | `/api/admin/gallery` | Manage gallery |
| GET/POST/PUT/DELETE | `/api/admin/testimonials` | Manage testimonials |
| GET/POST/PUT/DELETE | `/api/admin/faqs` | Manage FAQs |
| GET/PUT | `/api/admin/settings` | Manage settings |
| POST | `/api/admin/upload/image` | Upload image |

---

## 🎨 Design System

### Colors
- **Primary:** Green (#16a34a)
- **Accent:** Yellow (#facc15)
- **Background:** White (#ffffff)
- **Text:** Dark gray (#1f2937)

### Typography
- **Font:** Inter + Noto Sans Myanmar
- **Body:** 16px minimum

---

## 📱 Responsive Breakpoints
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

---

## 🚀 Deployment

### Frontend (Static Hosting)
Build the project and deploy `dist/` folder:

```bash
npm run build
# Deploy dist/ to Netlify, Vercel, or any static host
```

### Backend (Server)
Deploy Spring Boot JAR to:
- AWS EC2 / ECS
- Google Cloud Run
- Heroku
- DigitalOcean App Platform

---

## 📞 Clinic Information

- **Name:** KAY Dental Care
- **Address:** No. 102, 21st Street, Latha Township, Yangon, Myanmar
- **Phone:** 09 5158726, 09 786333243
- **Email:** kaydental@gmail.com

---

## 📄 License

Private project for KAY Dental Care.
