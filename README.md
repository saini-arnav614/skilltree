# SkillTree - Interactive Learning Roadmap

A beautiful, interactive web application for planning and tracking your learning journey. Visualize your skills as a tree structure, set milestones, and watch your progress grow!

## 🌟 Features

### Core Features
- **Add Skills with Milestones**: Create learning goals with specific, trackable milestones
- **Interactive Progress Tracking**: Click milestones to mark them complete and see your progress
- **Visual Tree Display**: Beautiful tree-style visualization of your learning journey
- **Progress Analytics**: View completion statistics and overall progress

### Bonus Features
- **Save/Load Progress**: Export your progress to JSON files or save locally
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Categorized Skills**: Organize skills by Programming, Design, Data Science, Business, or Other
- **Detailed Skill View**: Click on skills to see detailed progress and manage milestones

## 🚀 Getting Started

### Quick Start
1. Clone this repository or download the files
2. Open `index.html` in any modern web browser
3. Start adding your first skill!

### No Installation Required
This is a pure client-side application - no server setup needed!

## 🎯 How to Use

### Adding Your First Skill
1. Click the "Add Skill" button in the header
2. Fill in the skill name, description, and category
3. Add milestones (learning objectives) for this skill
4. Click "Add Skill" to create your first node

### Tracking Progress
- Click on milestone checkboxes to mark them complete
- Watch as completed milestones turn green
- Skills are automatically marked complete when all milestones are done
- View your overall progress in the sidebar

### Managing Your Roadmap
- Click on skill nodes to view detailed information
- Save your progress using the "Save Progress" button
- Load previous progress with the "Load Progress" button
- Progress is automatically saved to your browser's local storage

## 🏗️ Project Structure

```
skilltree/
├── index.html          # Main HTML structure
├── styles.css          # Beautiful, responsive styling
├── script.js           # Interactive functionality
└── README.md           # This documentation
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Delightful hover effects and transitions
- **Visual Feedback**: Clear progress indicators and completion states
- **Accessible**: Proper color contrast and keyboard navigation

## 🔧 Customization

### Adding New Categories
Edit the `categories` object in `script.js`:
```javascript
const categories = {
    programming: 'Programming',
    design: 'Design',
    data: 'Data Science',
    business: 'Business',
    your_category: 'Your Category Name'
};
```

### Styling
Modify `styles.css` to customize:
- Color schemes
- Layout spacing
- Animation timing
- Responsive breakpoints

## 💾 Data Persistence

Your progress is automatically saved to your browser's local storage. You can also:
- **Export**: Save your entire roadmap as a JSON file
- **Import**: Load a previously saved roadmap
- **Backup**: Regular exports ensure you never lose progress

## 🌐 Browser Compatibility

Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

Fully responsive design that works great on:
- Smartphones
- Tablets
- Desktop computers

## 🤝 Contributing

This is an open-source learning project. Feel free to:
- Fork the repository
- Submit pull requests
- Report issues
- Suggest new features

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Project Goals

This project was created as part of the Dev Vault Week 3 assignment to demonstrate:
- Interactive web development skills
- Modern CSS and JavaScript techniques
- User experience design
- Data persistence and management
- Responsive web design principles

## 🔮 Future Enhancements

Potential features for future versions:
- Skill dependencies and prerequisites
- Achievement badges and rewards
- Learning resource recommendations
- Social sharing of progress
- Cloud synchronization
- Advanced analytics and insights

---

**Happy Learning!** 🌱 Start building your skill tree today and watch your knowledge grow!
