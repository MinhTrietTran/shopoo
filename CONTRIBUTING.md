# 🌿 Git Workflow - Shopoo Project

## Cấu trúc nhánh (Branch Structure)

### 🌟 Main Branches
- **`main`** - Nhánh chính, chứa code production-ready
- **`develop`** - Nhánh phát triển chính, nơi tích hợp các features

### 🚀 Supporting Branches
- **`feature/*`** - Các nhánh phát triển tính năng mới
- **`bugfix/*`** - Các nhánh sửa lỗi
- **`hotfix/*`** - Các nhánh sửa lỗi khẩn cấp trên production

## 📋 Quy trình làm việc

### 1. Bắt đầu làm việc
```bash
# Clone repository
git clone https://github.com/MinhTrietTran/shopoo.git
cd shopoo

# Chuyển sang nhánh develop
git checkout develop
git pull origin develop
```

### 2. Tạo nhánh feature mới
```bash
# Tạo nhánh feature từ develop
git checkout -b feature/ten-tinh-nang

# Ví dụ:
git checkout -b feature/user-authentication
git checkout -b feature/product-listing
git checkout -b feature/shopping-cart
```

### 3. Làm việc trên feature
```bash
# Thực hiện các thay đổi
# Commit thường xuyên với message rõ ràng
git add .
git commit -m "feat: implement user login functionality"

# Push lên remote
git push -u origin feature/user-authentication
```

### 4. Tạo Pull Request
1. Vào GitHub repository
2. Tạo Pull Request từ `feature/ten-tinh-nang` → `develop`
3. Thêm description chi tiết về thay đổi
4. Request review từ team members
5. Đợi approve và merge

### 5. Sau khi merge
```bash
# Chuyển về develop và pull code mới
git checkout develop
git pull origin develop

# Xóa nhánh feature đã merge (tùy chọn)
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

## 📝 Commit Message Convention

### Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- **feat**: Tính năng mới
- **fix**: Sửa lỗi
- **docs**: Cập nhật tài liệu
- **style**: Thay đổi format, styling (không ảnh hưởng logic)
- **refactor**: Refactor code (không thêm feature, không sửa bug)
- **test**: Thêm hoặc sửa tests
- **chore**: Cập nhật build tools, dependencies

### Ví dụ:
```bash
git commit -m "feat(auth): add user login with JWT"
git commit -m "fix(cart): resolve quantity update bug"
git commit -m "docs(readme): update installation guide"
git commit -m "style(css): improve product card design"
```

## 👥 Quy tắc team

### 1. Code Review
- Mọi PR phải có ít nhất 1 reviewer approve
- Reviewer kiểm tra: logic, code style, performance, security
- Không merge PR của chính mình

### 2. Testing
- Phải test thủ công trước khi tạo PR
- Viết unit tests cho các functions quan trọng
- Đảm bảo không break existing features

### 3. Conflicts Resolution
```bash
# Khi có conflicts
git checkout develop
git pull origin develop
git checkout feature/your-feature
git merge develop

# Resolve conflicts manually
git add .
git commit -m "resolve merge conflicts"
git push origin feature/your-feature
```

## 🚀 Release Process

### 1. Prepare Release
```bash
# Tạo nhánh release từ develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Cập nhật version, changelog
# Test cuối cùng
git commit -m "chore: prepare release v1.0.0"
git push origin release/v1.0.0
```

### 2. Deploy to Production
```bash
# Merge release vào main
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags

# Merge lại vào develop
git checkout develop
git merge release/v1.0.0
git push origin develop

# Xóa nhánh release
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

## 🆘 Hotfix Process
```bash
# Tạo hotfix từ main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# Fix bug và test
git commit -m "hotfix: fix critical security vulnerability"
git push origin hotfix/critical-bug-fix

# Merge vào main và develop
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# Xóa hotfix branch
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

## 📚 Tài nguyên hữu ích

- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## 👨‍💻 Team Members

| Name | Role | GitHub Username |
|------|------|-----------------|
| Minh Triet | Lead Developer | @MinhTrietTran |
| ... | ... | ... |

---
**Lưu ý**: Luôn pull code mới nhất từ `develop` trước khi tạo feature branch mới!
