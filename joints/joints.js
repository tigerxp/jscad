function getParameterDefinitions () {
  return [
    {name: 'quality', type: 'choice', caption: 'Quality:', values: [0, 1], captions: ['Draft', 'High'], initial: 0},
    {name: 'axis', type: 'checkbox', checked: true, caption: 'Axis (off for prod!)'},
    {name: 'shape', type: 'choice', caption: 'Shape:', values: ['X', 'T', 'L'], captions: ['X-joint', 'T-joint', 'L-joint'], initial: 'T'},
    {name: 'thickness', caption: 'Thickness:', type: 'float', initial: 1.2},
    {name: 'height', caption: 'Height:', type: 'float', initial: 20, step: 0.1},
    {name: 'arm1_length', caption: 'Y Arm Length:', type: 'float', initial: 20, step: 0.1},
    {name: 'gap1', caption: 'Gap #1:', type: 'float', initial: 8, step: 0.1},
    {name: 'arm2_length', caption: 'X Arm Length:', type: 'float', initial: 20, step: 0.1},
    {name: 'gap2', caption: 'Gap #2:', type: 'float', initial: 8, step: 0.1}
  ];
}

function main(p) {
    var result = [];
    var t = p.thickness; // shortcode

    // Arm 1 (Y+)
    result.push(arm(p.height, p.arm1_length, p.gap1, t).translate([0, 0, 0]));

    // Arm 2 (X+)
    result.push(
        arm4 = arm(p.height, p.arm2_length, p.gap2, t)
            .rotateZ(-90)
            .translate([p.gap1 + t*2, 0, 0])
    );

    // Arm 3 (X-)
    if (p.shape == 'T' || p.shape == 'X') {
        result.push(
            arm(p.height, p.arm2_length, p.gap2, t)
                .rotateZ(90)
                .translate([0, -p.gap2 - t*2, 0])
        );
    }

    // Arm 4 (Y-)
    if (p.shape == 'X') {
        result.push(
            arm(p.height, p.arm1_length, p.gap1, t)
            .rotateZ(180)
            .translate([p.gap1 + t*2, -p.gap2 - t*2, 0])
        );
    }
    if (p.shape == 'L') {
        // close vertical gap
        result.push(cube({size: [t, p.gap2 + t, p.height]})
                .translate([0,-p.gap2 - t*2, t]));
    }
    if (p.shape == "L" || p.shape == 'T') {
        // close another vertical gap
        result.push(cube({size: [p.gap1 + t, t, p.height]})
                .translate([t, -p.gap2 - t*2, t]));
    }
    // close middle gap
    result.push(cube([p.gap1 + t*2, p.gap2 + t*2, t])
        .translate([0, -p.gap2 - t*2, 0]));


    if (p.axis) {
        result.push(axis(0.2));
    }

    return result;
}

function arm(h, l, gap, thickness) {
    return union(
        // bottom
        cube({size: [
            gap + thickness*2,
            l,
            thickness
        ]}),
        // left wall
        cube({size: [
            thickness,
            l + thickness,
            h
        ]}).translate([0,-thickness, thickness]),
        // right wall
        cube({size: [
            thickness,
            l,
            h
        ]}).translate([gap + thickness, 0, thickness])
    );
}

function axis(w=0.1, l=50) {
    return union (
        color("red", cube([l, w, w], {center:true})),
        color("green",cube([w, l, w], {center:true})),
        color("blue",cube([w, w, l],{center:true}))
    )
}
