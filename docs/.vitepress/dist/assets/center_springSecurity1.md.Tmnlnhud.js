import{_ as a,C as n,c as t,o as e,ae as r,G as p}from"./chunks/framework.Dh1jimFm.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"center/springSecurity1.md","filePath":"center/springSecurity1.md","lastUpdated":1743991845000}'),l={name:"center/springSecurity1.md"};function o(h,i,c,g,d,k){const s=n("Artalk");return e(),t("div",null,[i[0]||(i[0]=r(`<h2 id="springsecurity入门" tabindex="-1">springSecurity入门 <a class="header-anchor" href="#springsecurity入门" aria-label="Permalink to &quot;springSecurity入门&quot;">​</a></h2><blockquote><p>（本文适合从未接触过spring security的同学快速上手体验）</p></blockquote><h3 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h3><p><strong>Spring Security</strong> 是一个功能强大且高度可定制的安全框架，专门为基于 Spring 的应用程序提供身份验证（Authentication）和授权（Authorization）支持。它是 Spring 生态系统的一部分，广泛应用于保护 Java 应用程序，尤其是 Web 应用程序。</p><h4 id="核心功能" tabindex="-1">核心功能 <a class="header-anchor" href="#核心功能" aria-label="Permalink to &quot;核心功能&quot;">​</a></h4><ol><li><strong>身份验证</strong>：验证用户身份（如用户名和密码）。</li><li><strong>授权</strong>：控制用户访问资源的权限。</li><li><strong>防护攻击</strong>：防止常见的安全攻击，如 CSRF、会话固定等。</li><li><strong>集成</strong>：与 Spring 框架无缝集成，支持 OAuth2、LDAP、JWT 等现代安全技术。</li></ol><h3 id="下载案例-spring-security-入门实践" tabindex="-1">下载案例：Spring Security 入门实践 <a class="header-anchor" href="#下载案例-spring-security-入门实践" aria-label="Permalink to &quot;下载案例：Spring Security 入门实践&quot;">​</a></h3><h4 id="_1-下载-demo" tabindex="-1">1. 下载 Demo <a class="header-anchor" href="#_1-下载-demo" aria-label="Permalink to &quot;1. 下载 Demo&quot;">​</a></h4><p>首先，我们从阿里云的 Spring Boot 初始化工具下载一个基础项目模板。访问以下链接： <a href="https://start.aliyun.com/" target="_blank" rel="noreferrer">阿里云 Spring Initializr</a></p><p>在页面中，选择与下图相同的配置：</p><ul><li><strong>Spring Boot 版本</strong>：2.7.x</li><li><strong>依赖</strong>：Spring Web、Spring Security、MySQL Driver</li></ul><p><img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113002645539.png" alt="阿里云初始化工具配置"></p><h4 id="_2-导入项目到-idea" tabindex="-1">2. 导入项目到 IDEA <a class="header-anchor" href="#_2-导入项目到-idea" aria-label="Permalink to &quot;2. 导入项目到 IDEA&quot;">​</a></h4><p>下载完成后，将项目解压并导入到 IntelliJ IDEA 中。如果初次运行时未连接数据库，可以暂时注释掉 <code>application.properties</code> 或 <code>application.yml</code> 中的 JDBC 连接配置，以避免启动失败。</p><h4 id="_3-运行项目" tabindex="-1">3. 运行项目 <a class="header-anchor" href="#_3-运行项目" aria-label="Permalink to &quot;3. 运行项目&quot;">​</a></h4><p>启动项目后，控制台会输出 Spring Security 自动生成的默认用户信息，如下图所示：</p><p><img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113002905543.png" alt="项目启动成功"></p><p>红框部分显示的是 Spring Security 自动生成的默认用户名和密码。默认用户名为 <code>user</code>，密码为控制台输出的一串随机字符串。</p><h4 id="_4-测试-spring-security-的保护机制" tabindex="-1">4. 测试 Spring Security 的保护机制 <a class="header-anchor" href="#_4-测试-spring-security-的保护机制" aria-label="Permalink to &quot;4. 测试 Spring Security 的保护机制&quot;">​</a></h4><p>为了验证 Spring Security 的默认保护机制，我们编写一个简单的测试接口：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">package</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> top.miqiu.security.controller;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RestController</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">GetMapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/login2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">login</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;login&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>启动项目后，访问 <code>http://localhost:8080/login2</code>，会发现 Spring Security 自动拦截了该请求，并跳转到默认的登录页面：</p><p><img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113003157980.png" alt="Spring Security 登录页面"></p><h4 id="_5-默认用户与登录" tabindex="-1">5. 默认用户与登录 <a class="header-anchor" href="#_5-默认用户与登录" aria-label="Permalink to &quot;5. 默认用户与登录&quot;">​</a></h4><p>Spring Security 在启动时会自动生成一个默认用户：</p><ul><li><strong>用户名</strong>：<code>user</code></li><li><strong>密码</strong>：控制台输出的随机字符串</li></ul><p>使用默认用户登录后，即可访问受保护的资源 <code>/login2</code>。</p><h3 id="修改-spring-security-默认密码" tabindex="-1">修改 Spring Security 默认密码 <a class="header-anchor" href="#修改-spring-security-默认密码" aria-label="Permalink to &quot;修改 Spring Security 默认密码&quot;">​</a></h3><p>在 Spring Security 中，默认情况下会生成一个随机密码，但我们可以通过配置文件自定义用户名和密码，以便更方便地管理和使用。</p><hr><h4 id="_1-通过配置文件修改默认密码" tabindex="-1">1. 通过配置文件修改默认密码 <a class="header-anchor" href="#_1-通过配置文件修改默认密码" aria-label="Permalink to &quot;1. 通过配置文件修改默认密码&quot;">​</a></h4><p>在 <code>application.properties</code> 或 <code>application.yml</code> 中，添加以下配置来设置自定义的用户名和密码：</p><p><strong><code>application.properties</code> 配置：</strong></p><div class="language-properties vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">properties</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">spring.security.user.name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=admin</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">spring.security.user.password</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=123456</span></span></code></pre></div><p><strong><code>application.yml</code> 配置：</strong></p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  security</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    user</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">admin</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      password</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">123456</span></span></code></pre></div><hr><h4 id="_2-重启项目并验证" tabindex="-1">2. 重启项目并验证 <a class="header-anchor" href="#_2-重启项目并验证" aria-label="Permalink to &quot;2. 重启项目并验证&quot;">​</a></h4><p>修改配置文件后，重启项目。此时，控制台将不再输出随机生成的密码，而是使用我们在配置文件中设置的用户名和密码。</p><p><img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113004036939.png" alt="控制台无随机密码"></p><hr><h4 id="_3-使用自定义账号登录" tabindex="-1">3. 使用自定义账号登录 <a class="header-anchor" href="#_3-使用自定义账号登录" aria-label="Permalink to &quot;3. 使用自定义账号登录&quot;">​</a></h4><p>访问受保护的资源（如 <code>/login2</code>），Spring Security 会跳转到登录页面。输入配置文件中设置的用户名和密码：</p><ul><li><strong>用户名</strong>：<code>admin</code></li><li><strong>密码</strong>：<code>123456</code></li></ul><p>登录成功后，即可访问受保护的资源：</p><p><img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250113004218691.png" alt="登录成功"></p><hr>`,47)),p(s)])}const E=a(l,[["render",o]]);export{y as __pageData,E as default};
