/**
 * Welcome to the Looker Custom Visualization Builder! Please refer to the following resources
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 *  - How to use the CVB - https://developers.looker.com/marketplace/tutorials/about-custom-viz-builder
 **/

const visObject = {
  /**
   * Configuration options for your visualization. In Looker, these show up in the vis editor
   * panel but here, you can just manually set your default values in the code.
   **/
  options: {
    first_option: {
      type: "string",
      label: "My First Option",
      default: "Default Value",
    },
    second_option: {
      type: "number",
      label: "My Second Option",
      default: 42,
    },
  },

  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
  create: function (element, config) {
    element.innerHTML = "<h1>Ready to render!</h1>";
  },

  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
  updateAsync: function (
    data,
    element,
    config,
    queryResponse,
    details,
    doneRendering
  ) {
    var keys = Object.keys(data[0]);

    var firstKey = keys[0];
    var secondKey = keys[1];
    var groupKey = "";

    if (keys?.length >= 3) groupKey = keys[2];

    function getNodes(data) {
      var groupsMap = [];
      var nodes = [];

      data.forEach((item) => {
        var firstNodeKey = item[firstKey];
        var secondNodeKey = item[secondKey];

        let index = -1;

        if (groupKey !== "") {
          var groupNodeKey = item[groupKey];
          index = groupsMap?.findIndex((elt) => elt === groupNodeKey);

          if (index < 0) {
            groupsMap.push(groupNodeKey);
          }
        }

        if (!nodes.some((node) => node.id === firstNodeKey)) {
          nodes.push({
            id: firstNodeKey,
            label: firstNodeKey,
            ...(index && { group: index }),
          });
        }

        if (
          !nodes.some((node) => node.id === secondNodeKey) &&
          !data.some((d) => d[firstKey] === secondNodeKey)
        ) {
          nodes.push({
            id: secondNodeKey,
            label: secondNodeKey,
            ...(index && { group: index }),
          });
        }
      });
      return nodes;
    }
    var nodes = getNodes(data);

    var edges = data.map((item) => ({
      from: item?.[firstKey],
      to: item?.[secondKey],
    }));

    const content = { nodes, edges };

    var options = {
      layout: {
        hierarchical: {
          direction: "LR",
          sortMethod: "directed",
        },
      },
      nodes: {
        fixed: true,
        shape: "box",
        size: 40,
        borderWidth: 1,
        color: {
          background: "lightblue",
          border: "blue",
          hover: "red",
          highlight: {
            background: "lightcyan",
            border: "cyan",
          },
        },
        font: {
          size: 16,
          color: "black",
        },
      },
      edges: {
        arrows: "to",
        width: 2,
        color: {
          color: "black",
          hover: "red",
          highlight: "#F7E7CE",
        },
      },
      interaction: {
        hover: true,
      },
      physics: {
        enabled: false,
      },
    };

    var network = new vis.Network(element, content, options);
    doneRendering();
  },
};

looker.plugins.visualizations.add(visObject);
