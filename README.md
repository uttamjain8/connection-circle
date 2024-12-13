# Connection Circle Visualization Tool

Welcome to the **Connection Circle Visualization Tool**! This tool is designed to visualize relationships and connections between entities, aiding in understanding and communicating complex systems. It was originally developed as a personal project to address the lack of practical digital tools for such visualizations, which are often created manually using pen and paper. Recognizing its potential, this tool is now open to a larger audience of systems thinkers and developers.

## Features

- **Entity and Connection Input**: Easily add entities and connections using a simple text-based input interface.
- **Dynamic Visualization**: Visualize connections with a force-directed graph using D3.js.
- **Export Options**:
  - Download the visualization as a PNG image.
  - Copy the graph to the clipboard.

## Use Cases

- Mapping and analyzing complex systems.
- Visualizing relationships and dependencies in projects.
- Supporting discussions and workshops on systems thinking.

## Installation and Usage

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/connection-circle.git
   ```
2. Open the project directory:
   ```bash
   cd connection-circle
   ```
3. Open `index.html` in your browser.
   > No additional setup or dependencies are required as this is a purely client-side tool.

## How to Use

1. **Input Entities and Connections**:

   - Add each entity in the first text area, one per line.
   - Specify connections in the second text area using the format `source->target` (e.g., `A->B`).

2. **Render Visualization**:

   - Click the **Render** button to generate the visualization.

3. **Export Options**:

   - Use the **Download** or **Copy** buttons to save or share the visualization.

## Example

### Input

#### Entities:

```
Node1
Node2
Node3
Node4
Node5
Node6
```

#### Connections:

```
Node1->Node2
Node2->Node3
Node1->Node2
Node4->Node3
Node5->Node2
Node6->Node2
Node1->Node4
Node2->Node5
Node3->Node6
Node4->Node5
```

### Output
![image](https://github.com/user-attachments/assets/3da924cf-33df-4918-86d1-58345d188e76)

A force-directed graph showing three nodes connected in sequence.

## Collaboration and Contributions

This tool is open for collaboration and contributions. We welcome enhancements that can:

- Improve the user interface.
- Enhance performance and scalability.
- Add new features like edge weighting, node categorization, or real-time collaboration.
- Fix bugs or improve code quality.

To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is open-source under the [MIT License](LICENSE).

## Contact

For any questions, suggestions, or feedback, please reach out to:

- Email: [uttamjodawat@iisc.ac.in](mailto:uttamjodawat@iisc.ac.in)
- GitHub: [uttamjain8](https://github.com/uttamjain8)

---

Let’s build a powerful visualization tool together to support systems thinking!

